package handlers

import (
	"github.com/gofiber/fiber/v2"
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
