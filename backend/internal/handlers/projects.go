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

	query := `
	SELECT id, name, slug, short_description, full_description, status,
	start_date, end_date, github_url, live_url, featured,
	difficulty_level, image_url, demo_video_url, display_order,
	view_count, created_at, updated_at
	FROM projects
	WHERE status = 'active'
	`

	if featuredOnly == "true" {
		query += "AND featured = true"
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
	SELECT s.id, s.name, s.category, s.proficency_level, s.icon
	FROM skills s
	INNER JOIN poject_skills ps ON s.id = ps.Skill_id
	WHERE ps.project_id = $1
	ORDER BY ps.is_primary DESC, s.name ASC
	`

	h.db.DB.Select(&skills, skillQuery, project.ID)

	h.db.DB.Exec("UPDATE projects SET view_count + 1 WHERE id = $1", project.ID)

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
	var project models.Project

	if err := c.BodyParser(&project); err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request",
			Code:    400,
		})
	}

	query := `
	INSERT INTO projects (name, slug, short_description, full_description, status,
	start_date, end_date, github_url, live_url, featured,
	difficulty_level, image_url, display_order)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
	RETURNING id, created_at, updated_at
	`

	err := h.db.DB.QueryRow(
		query,
		project.Name,
		project.Slug,
		project.ShortDescription,
		project.FullDescription,
		project.Status,
		project.StartDate,
		project.EndDate,
		project.GithubURL,
		project.LiveURL,
		project.Featured,
		project.DifficultyLevel,
		project.ImageURL,
		project.DisplayOrder,
	).Scan(&project.ID, project.CreatedAt, project.UpdatedAt)

	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   "database_error",
			Message: "Failed to create project",
			Code:    500,
		})
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

	return c.JSON(project)
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
