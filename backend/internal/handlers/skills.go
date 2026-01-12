package handlers

import (
	"database/sql"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jphillips1313/portfolio-backend/internal/database"
	"github.com/jphillips1313/portfolio-backend/internals/models"
)

type SkillsHandler struct {
	db *database.Database
}

func NewSkillsHandler(db *database.Database) *SkillsHandler {
	return &SkillsHandler{db: db}
}

// Return all skills (Optionally filter by category)
func (h *SkillsHandler) GetAllSkills(c *fiber.Ctx) error {
	category := c.Query("category")

	var skills []models.Skill

	query := `
		SELECT id, name, category, proficiency_level, years_experience, status,
		       first_learned_date, last_used_date, description, icon,
		       display_order, created_at, updated_at
		FROM skills
		WHERE status = 'active'
	`

	var args []interface{}

	if category != "" {
		query += " AND category = $1"
		args = append(args, category)
	}

	query += " ORDER BY display_order ASC, proficiency_level DESC"

	err := h.db.DB.Select(&skills, query, args...)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   "database_error",
			Message: "Failed to fetch skills",
			Code:    500,
		})
	}

	// Group by category
	skillsByCategory := make(map[string][]models.Skill)
	for _, skill := range skills {
		cat := "Other"
		if skill.Category != nil {
			cat = *skill.Category
		}
		skillsByCategory[cat] = append(skillsByCategory[cat], skill)
	}

	return c.JSON(fiber.Map{
		"success":     true,
		"data":        skills,
		"by_category": skillsByCategory,
		"count":       len(skills),
	})
}

// Updates a Skill record
func (h *SkillsHandler) Update(c *fiber.Ctx) error {
	id := c.Params("id")

	skillID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Skill Id format",
		})
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	query := "UPDATE skills SET updated_at = CURRENT_TIMESTAMP"
	args := []interface{}{}
	argsPosition := 1

	allowedFields := map[string]bool{
		"name": true, "category": true, "proficiency_level": true,
		"years_experience": true, "status": true, "first_learned_date": true,
		"last_used_date": true, "description": true, "icon": true,
		"display_order": true,
	}

	for field, value := range updates {
		if allowedFields[field] {
			query += fmt.Sprintf(", %s = $%d", field, argsPosition)
			args = append(args, value)
			argsPosition++
		}
	}

	query += fmt.Sprintf(" WHERE id = $%d RETURNING *", argsPosition)
	args = append(args, skillID)

	var skill models.Skill
	err = h.db.DB.Get(&skill, query, args...)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Skill not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update skill",
		})
	}

	return c.JSON(skill)
}

// Create creates a new skill
func (h *SkillsHandler) Create(c *fiber.Ctx) error {
	var input struct {
		Name             string  `json:"name"`
		Category         string  `json:"category"`
		ProficiencyLevel int     `json:"proficiency_level"`
		YearsExperience  float64 `json:"years_experience"`
		Icon             string  `json:"icon"`
		Description      *string `json:"description"`
		DisplayOrder     int     `json:"display_order"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	if input.Name == "" || input.Category == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Name and category are required",
		})
	}

	query := `
		INSERT INTO skills (
			name, category, proficiency_level, years_experience,
			icon, description, display_order, status
		) VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
		RETURNING id, name, category, proficiency_level, years_experience, status,
		          first_learned_date, last_used_date, description, icon,
		          display_order, created_at, updated_at
	`

	var skill models.Skill
	err := h.db.DB.QueryRow(
		query,
		input.Name,
		input.Category,
		input.ProficiencyLevel,
		input.YearsExperience,
		input.Icon,
		input.Description,
		input.DisplayOrder,
	).Scan(
		&skill.ID,
		&skill.Name,
		&skill.Category,
		&skill.ProficiencyLevel,
		&skill.YearsExperience,
		&skill.Status,
		&skill.FirstLearnedDate,
		&skill.LastUsedDate,
		&skill.Description,
		&skill.Icon,
		&skill.DisplayOrder,
		&skill.CreatedAt,
		&skill.UpdatedAt,
	)

	if err != nil {
		println("Create skill error:", err.Error())
		return c.Status(500).JSON(fiber.Map{
			"error":   "database_error",
			"message": "Failed to create skill",
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"success": true,
		"data":    skill,
	})
}

// Deletes a skill entry
func (h *SkillsHandler) Delete(c *fiber.Ctx) error {
	id := c.Params("id")

	skillID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Skill id format",
		})
	}

	result, err := h.db.DB.Exec("DELETE FROM skills WHERE id = $1", skillID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to delete skill",
		})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Skill not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Skill deleted successfully",
	})
}
