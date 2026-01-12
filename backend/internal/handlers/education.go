package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jphillips1313/portfolio-backend/internal/database"
	"github.com/jphillips1313/portfolio-backend/internals/models"
)

type EducationHandler struct {
	db *database.Database
}

func NewEducationHandler(db *database.Database) *EducationHandler {
	return &EducationHandler{db: db}
}

// Return all education entries with their modules
func (h *EducationHandler) GetAllEducation(c *fiber.Ctx) error {
	var education []models.Education

	query :=
		`SELECT id, degree, institution, field_of_study, start_date, end_date, grade, description, slug, display_order,
	created_at, updated_at
	FROM education
	ORDER BY display_order ASC`

	err := h.db.DB.Select(&education, query)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   "Database_error",
			Message: "Failed to fetch education data",
			Code:    500,
		})
	}

	// Fetch modules for each education entry
	for i := range education {
		var modules []models.Module
		moduleQuery := `
		SELECT id, education_id, name, code, grade, credits, semester, description,
		detailed_content, display_order, created_at, updated_at
		FROM modules
		WHERE education_id = $1
		ORDER BY display_order ASC
		`

		err = h.db.DB.Select(&modules, moduleQuery, education[i].ID)
		if err != nil {
			// If no modules found or error, set empty array
			modules = []models.Module{}
		}
		education[i].Modules = modules
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
			Message: "Failed to create education entry",
			Code:    500,
		})
	}

	return c.Status(201).JSON(fiber.Map{
		"success": true,
		"data":    education,
	})
}

// Updates an education record
func (h *EducationHandler) Update(c *fiber.Ctx) error {
	id := c.Params("id")

	//parse UUID
	educationID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Inavlid request body",
		})
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	query := "UPDATE education SET updated_at = CURRENT_TIMESTAMP"
	args := []interface{}{}
	argsPosition := 1

	allowedFields := map[string]bool{
		"degree": true, "institution": true, "field_of_study": true,
		"start_date": true, "end_date": true, "grade": true,
		"description": true, "display_order": false,
	}

	for field, value := range updates {
		if allowedFields[field] {
			query += fmt.Sprintf(", %s = $%d", field, argsPosition)
			args = append(args, value)
			argsPosition++
		}
	}

	query += fmt.Sprintf(" WHERE id = $%d RETURNING *", argsPosition)
	args = append(args, educationID)

	//execute update
	var education models.Education
	err = h.db.DB.Get(&education, query, args...)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "education record not found",
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update education",
		})
	}

	return c.JSON(education)
}

// Delete an education record
func (h *EducationHandler) Delete(c *fiber.Ctx) error {
	id := c.Params("id")

	educationID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid education ID format",
		})
	}

	result, err := h.db.DB.Exec("DELETE FROM education WHERE id = $1", educationID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete education record",
		})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Record not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Education deleted successfully",
	})
}

// Updates a module record
func (h *EducationHandler) UpdateModule(c *fiber.Ctx) error {
	id := c.Params("id")

	moduleID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Module Id",
		})
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	//Dynamic UPDATE query
	query := "UPDATE modules SET updated_at = CURRENT_TIMESTAMP"
	args := []interface{}{}
	argsPosition := 1

	allowedFields := map[string]bool{
		"name": true, "code": true, "grade": true, "credits": true,
		"semester": true, "description": true, "detailed_content": true,
		"display_order": false,
	}

	for field, value := range updates {
		if allowedFields[field] {
			// Special handling for detailed_content (JSONB field)
			if field == "detailed_content" && value != nil {
				// If it's a string, try to parse it as JSON
				// If it fails, wrap it as a simple JSON object
				if strValue, ok := value.(string); ok {
					// Try to parse as JSON first
					var jsonTest interface{}
					if json.Unmarshal([]byte(strValue), &jsonTest) != nil {
						// Not valid JSON, wrap it in an object
						wrappedJSON, _ := json.Marshal(map[string]string{"content": strValue})
						value = string(wrappedJSON)
					}
				}
			}

			query += fmt.Sprintf(", %s = $%d", field, argsPosition)
			args = append(args, value)
			argsPosition++
		}
	}

	query += fmt.Sprintf(" WHERE id = $%d RETURNING *", argsPosition)
	args = append(args, moduleID)

	var module models.Module
	err = h.db.DB.Get(&module, query, args...)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Module not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Failed to update module",
			"details": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    module,
	})
}

// Deletes a module
func (h *EducationHandler) DeleteModule(c *fiber.Ctx) error {
	id := c.Params("id")

	moduleID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Module ID format",
		})
	}

	result, err := h.db.DB.Exec("DELETE FROM modules WHERE id = $1", moduleID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete module",
		})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Module not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Module deleted successfully",
	})

}

// Creates a new module
func (h *EducationHandler) CreateModule(c *fiber.Ctx) error {
	var input struct {
		EducationID     string      `json:"education_id"`
		Name            string      `json:"name"`
		Code            *string     `json:"code"`
		Grade           *string     `json:"grade"`
		Credits         *int        `json:"credits"`
		Semester        *string     `json:"semester"`
		Description     *string     `json:"description"`
		DetailedContent interface{} `json:"detailed_content"`
		DisplayOrder    int         `json:"display_order"`
	}

	if err := c.BodyParser(&input); err != nil {
		println("Body parse error:", err.Error())
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   "Invalid request body",
			"details": err.Error(),
		})
	}

	println("Received create request:", fmt.Sprintf("%+v", input))

	// Parse education_id
	educationID, err := uuid.Parse(input.EducationID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid education_id format",
		})
	}

	// Validate required fields
	if input.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "name is required",
		})
	}

	// Handle detailed_content - convert string to JSON if needed
	var detailedContent interface{}
	if input.DetailedContent != nil {
		if strValue, ok := input.DetailedContent.(string); ok && strValue != "" {
			// Try to parse as JSON first
			var jsonTest interface{}
			if json.Unmarshal([]byte(strValue), &jsonTest) != nil {
				// Not valid JSON, wrap it in an object
				wrappedJSON, _ := json.Marshal(map[string]string{"content": strValue})
				detailedContent = string(wrappedJSON)
			} else {
				detailedContent = strValue
			}
		} else {
			detailedContent = input.DetailedContent
		}
	}

	query := `
		INSERT INTO modules (education_id, name, code, grade, credits, semester, description, detailed_content, display_order)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id, education_id, name, code, grade, credits, semester, description, detailed_content, display_order, created_at, updated_at
	`

	var module models.Module
	err = h.db.DB.QueryRow(
		query,
		educationID,
		input.Name,
		input.Code,
		input.Grade,
		input.Credits,
		input.Semester,
		input.Description,
		detailedContent,
		input.DisplayOrder,
	).Scan(
		&module.ID,
		&module.EducationID,
		&module.Name,
		&module.Code,
		&module.Grade,
		&module.Credits,
		&module.Semester,
		&module.Description,
		&module.DetailedContent,
		&module.DisplayOrder,
		&module.CreatedAt,
		&module.UpdatedAt,
	)

	if err != nil {
		println("Database error:", err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Failed to create module",
			"details": err.Error(),
		})
	}

	println("Module created successfully:", module.ID.String())
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"data":    module,
	})
}
