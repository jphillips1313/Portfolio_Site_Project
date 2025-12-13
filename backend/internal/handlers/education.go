package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/jphillips1313/portfolio-backend/internal/database"
	"github.com/jphillips1313/portfolio-backend/internals/models"
)

type EducationHandler struct {
	db *database.Database
}

func NewEducationHandler(db *database.Database) *EducationHandler {
	return &EducationHandler{db: db}
}

// Return all education entries
func (h *EducationHandler) GetAllEducation(c *fiber.Ctx) error {
	var education []models.Education

	query :=
		`SELECT id, degree, institution, field_of_study, start_date, end_date, grade, description, slug, display_order,
	created_at, updated_at
	FROM education`

	err := h.db.DB.Select(&education, query)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   "Database_error",
			Message: "Failed to fetch education data",
			Code:    500,
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    education,
		"count":   len(education),
	})
}

func (h *EducationHandler) GetEducationBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")

	var education models.Education

	query :=
		`SELECT id, degree, institution, field_of_study, start_date, end_date, grade, description, slug, display_order,
	created_at, updated_at
	FROM education
	WHERE slug = $1
	`

	err := h.db.DB.Get(&education, query, slug)
	if err != nil {
		return c.Status(404).JSON(models.ErrorResponse{
			Error:   "not_found",
			Message: "Education entry not found",
			Code:    404,
		})
	}

	// DEBUG: Print the education ID
	println("Education ID:", education.ID.String())

	//Get modules for this education element
	var modules []models.Module
	moduleQuery := `
	SELECT id, education_id, name, code, grade, credits, semester, description,
	detailed_content, display_order, created_at, updated_at
	FROM modules
	WHERE education_id = $1
	ORDER BY display_order ASC
	`

	err = h.db.DB.Select(&modules, moduleQuery, education.ID)
	if err != nil {
		// DEBUG: Print the error
		println("Module query error:", err.Error())
		modules = []models.Module{}
	} else {
		// DEBUG: Print module count
		println("Found modules:", len(modules))
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data": fiber.Map{
			"education": education,
			"modules":   modules,
		},
	})
}

// Create a new education entry TODO:Add authentication later for admin
func (h *EducationHandler) CreateEducation(c *fiber.Ctx) error {
	var education models.Education

	if err := c.BodyParser(&education); err != nil {
		return c.Status(400).JSON(models.ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request body",
			Code:    400,
		})
	}

	query := `
	INSERT INTO education (degree, institution, field_of_study, start_date, end_date, grade, description, slug, display_order)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	RETURNING id, created_at, updated_at
	`

	err := h.db.DB.QueryRow(
		query,
		education.Degree,
		education.Institution,
		education.FieldOfStudy,
		education.StartDate,
		education.EndDate,
		education.Grade,
		education.Description,
		education.Slug,
		education.DisplayOrder,
	).Scan(&education.ID, &education.CreatedAt, &education.UpdatedAt)

	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   "database_error",
			Message: "Failed to create eduaction entry",
			Code:    500,
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"success": true,
		"data":    education,
	})
}
