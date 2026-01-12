package handlers

import (
	"database/sql"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jphillips1313/portfolio-backend/internal/database"
	"github.com/jphillips1313/portfolio-backend/internals/models"
)

type ProjectsHandler struct {
	db *database.Database
}

func NewProjectsHandler(db *database.Database) *ProjectsHandler {
	return &ProjectsHandler{db: db}
}

// Return all projects
func (h *ProjectsHandler) GetAllProjects(c *fiber.Ctx) error {
	featuredOnly := c.Query("featured")

	var projects []models.Project

	// Include active projects, or archived projects that are featured
	query := `
	SELECT id, name, slug, short_description, full_description, status,
	start_date, end_date, github_url, live_url, featured,
	difficulty_level, image_url, demo_video_url, display_order,
	view_count, created_at, updated_at
	FROM projects
	WHERE (status = 'active' OR (status = 'archived' AND featured = true))
	`

	if featuredOnly == "true" {
		query += "AND featured = true "
	}

	query += "ORDER BY display_order ASC, created_at DESC"

	err := h.db.DB.Select(&projects, query)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   "database_error",
			Message: "Failed to fetch database",
			Code:    500,
		})
	}

	projectsWithSkills := make([]models.ProjectWithSkills, len(projects))
	for i := range projects {
		var skills []models.Skill
		skillQuery := `
			SELECT s.id, s.name, s.category, s.icon
			FROM skills s
			INNER JOIN project_skills ps ON s.id = ps.skill_id
			WHERE ps.project_id = $1
			ORDER BY ps.is_primary DESC, s.name ASC
		`
		h.db.DB.Select(&skills, skillQuery, projects[i].ID)

		projectsWithSkills[i] = models.ProjectWithSkills{
			Project: projects[i],
			Skills:  skills,
		}
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    projectsWithSkills,
		"count":   len(projectsWithSkills),
	})
}

// Gets projects by slug
func (h *ProjectsHandler) GetProjectBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")

	var project models.Project

	query := `
	SELECT id, name, slug, short_description, full_description, status,
	start_date, end_date, github_url, live_url, featured,
	difficulty_level, image_url, demo_video_url, display_order,
	view_count, created_at, updated_at
	FROM projects
	WHERE slug = $1 AND status = 'active'
	`

	err := h.db.DB.Get(&project, query, slug)
	if err != nil {
		return c.Status(404).JSON(models.ErrorResponse{
			Error:   "not_found",
			Message: "Project not found",
			Code:    404,
		})
	}

	var skills []models.Skill
	skillQuery := `
	SELECT s.id, s.name, s.category, s.proficiency_level, s.icon
	FROM skills s
	INNER JOIN project_skills ps ON s.id = ps.skill_id
	WHERE ps.project_id = $1
	ORDER BY ps.is_primary DESC, s.name ASC
	`

	h.db.DB.Select(&skills, skillQuery, project.ID)

	h.db.DB.Exec("UPDATE projects SET view_count = view_count + 1 WHERE id = $1", project.ID)

	return c.JSON(fiber.Map{
		"success": true,
		"data": fiber.Map{
			"project": project,
			"skills":  skills,
		},
	})
}

// Create a new project (Admin Only)
func (h *ProjectsHandler) CreateProject(c *fiber.Ctx) error {
	var input struct {
		Name             string   `json:"name"`
		Slug             string   `json:"slug"`
		ShortDescription *string  `json:"short_description"`
		FullDescription  *string  `json:"full_description"`
		Status           string   `json:"status"`
		StartDate        *string  `json:"start_date"`
		EndDate          *string  `json:"end_date"`
		GithubURL        *string  `json:"github_url"`
		LiveURL          *string  `json:"live_url"`
		Featured         bool     `json:"featured"`
		DifficultyLevel  *string  `json:"difficulty_level"`
		ImageURL         *string  `json:"image_url"`
		DisplayOrder     int      `json:"display_order"`
		SkillIDs         []string `json:"skill_ids"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request body",
			Code:    400,
		})
	}

	// Validate required fields
	if input.Name == "" {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   "validation_error",
			Message: "name is required",
			Code:    400,
		})
	}
	if input.Slug == "" {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   "validation_error",
			Message: "slug is required",
			Code:    400,
		})
	}

	query := `
	INSERT INTO projects (name, slug, short_description, full_description, status,
	start_date, end_date, github_url, live_url, featured,
	difficulty_level, image_url, display_order)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
	RETURNING id, name, slug, short_description, full_description, status,
	start_date, end_date, github_url, live_url, featured,
	difficulty_level, image_url, demo_video_url, display_order,
	view_count, created_at, updated_at
	`

	var project models.Project
	err := h.db.DB.QueryRow(
		query,
		input.Name,
		input.Slug,
		input.ShortDescription,
		input.FullDescription,
		input.Status,
		input.StartDate,
		input.EndDate,
		input.GithubURL,
		input.LiveURL,
		input.Featured,
		input.DifficultyLevel,
		input.ImageURL,
		input.DisplayOrder,
	).Scan(
		&project.ID,
		&project.Name,
		&project.Slug,
		&project.ShortDescription,
		&project.FullDescription,
		&project.Status,
		&project.StartDate,
		&project.EndDate,
		&project.GithubURL,
		&project.LiveURL,
		&project.Featured,
		&project.DifficultyLevel,
		&project.ImageURL,
		&project.DemoVideoURL,
		&project.DisplayOrder,
		&project.ViewCount,
		&project.CreatedAt,
		&project.UpdatedAt,
	)

	if err != nil {
		println("Create project error:", err.Error())
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   "database_error",
			Message: "Failed to create project",
			Code:    500,
		})
	}

	// Add skills if provided
	if len(input.SkillIDs) > 0 {
		for _, skillIDStr := range input.SkillIDs {
			skillID, err := uuid.Parse(skillIDStr)
			if err != nil {
				continue // Skip invalid UUIDs
			}
			h.db.DB.Exec("INSERT INTO project_skills (project_id, skill_id, is_primary) VALUES ($1, $2, false)", project.ID, skillID)
		}
	}

	return c.Status(201).JSON(fiber.Map{
		"success": true,
		"data":    project,
	})
}

// Update updates a project record
func (h *ProjectsHandler) Update(c *fiber.Ctx) error {
	id := c.Params("id")

	projectID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID format",
		})
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Extract skill_ids before building project update query
	var skillIDs []string
	if skillIDsRaw, ok := updates["skill_ids"]; ok {
		if skillIDsArray, ok := skillIDsRaw.([]interface{}); ok {
			for _, sid := range skillIDsArray {
				if sidStr, ok := sid.(string); ok {
					skillIDs = append(skillIDs, sidStr)
				}
			}
		}
		delete(updates, "skill_ids") // Remove from project updates
	}

	// Build dynamic UPDATE query
	query := "UPDATE projects SET updated_at = CURRENT_TIMESTAMP"
	args := []interface{}{}
	argPosition := 1

	allowedFields := map[string]bool{
		"name": true, "slug": true, "short_description": true,
		"full_description": true, "status": true, "start_date": true,
		"end_date": true, "github_url": true, "live_url": true,
		"featured": true, "difficulty_level": true, "image_url": true,
		"demo_video_url": true, "display_order": true,
	}

	for field, value := range updates {
		if allowedFields[field] {
			query += fmt.Sprintf(", %s = $%d", field, argPosition)
			args = append(args, value)
			argPosition++
		}
	}

	query += fmt.Sprintf(" WHERE id = $%d RETURNING *", argPosition)
	args = append(args, projectID)

	var project models.Project
	err = h.db.DB.Get(&project, query, args...)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Project not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update project",
		})
	}

	// Update skills if provided
	if len(skillIDs) > 0 {
		// Delete existing skills
		h.db.DB.Exec("DELETE FROM project_skills WHERE project_id = $1", projectID)

		// Add new skills
		for _, skillIDStr := range skillIDs {
			skillID, err := uuid.Parse(skillIDStr)
			if err != nil {
				continue // Skip invalid UUIDs
			}
			h.db.DB.Exec("INSERT INTO project_skills (project_id, skill_id, is_primary) VALUES ($1, $2, false)", projectID, skillID)
		}
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    project,
	})
}

// Delete deletes a project record
func (h *ProjectsHandler) Delete(c *fiber.Ctx) error {
	id := c.Params("id")

	projectID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID format",
		})
	}

	result, err := h.db.DB.Exec("DELETE FROM projects WHERE id = $1", projectID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete project",
		})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Project deleted successfully",
	})
}

// UploadImage handles image upload for a project
func (h *ProjectsHandler) UploadImage(c *fiber.Ctx) error {
	id := c.Params("id")

	projectID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid project ID format",
		})
	}

	// Check if project exists
	var exists bool
	err = h.db.DB.Get(&exists, "SELECT EXISTS(SELECT 1 FROM projects WHERE id = $1)", projectID)
	if err != nil || !exists {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Project not found",
		})
	}

	// Get the file from the form
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "No file uploaded",
		})
	}

	// Validate file size (max 5MB)
	if file.Size > 5*1024*1024 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "File size too large (max 5MB)",
		})
	}

	// Validate file type
	contentType := file.Header.Get("Content-Type")
	validTypes := map[string]bool{
		"image/jpeg": true,
		"image/jpg":  true,
		"image/png":  true,
		"image/gif":  true,
		"image/webp": true,
	}

	if !validTypes[contentType] {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid file type (only images allowed)",
		})
	}

	// Generate unique filename
	ext := ""
	switch contentType {
	case "image/jpeg", "image/jpg":
		ext = ".jpg"
	case "image/png":
		ext = ".png"
	case "image/gif":
		ext = ".gif"
	case "image/webp":
		ext = ".webp"
	}

	filename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
	uploadPath := fmt.Sprintf("/app/uploads/projects/%s", filename)

	// Save the file
	if err := c.SaveFile(file, uploadPath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to save file",
		})
	}

	// Update project's image_url in database
	publicURL := fmt.Sprintf("/uploads/projects/%s", filename)
	_, err = h.db.DB.Exec("UPDATE projects SET image_url = $1 WHERE id = $2", publicURL, projectID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update project",
		})
	}

	return c.JSON(fiber.Map{
		"success":   true,
		"image_url": publicURL,
		"message":   "Image uploaded successfully",
	})
}
