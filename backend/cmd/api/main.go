package main

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"

	"github.com/jphillips1313/portfolio-backend/internal/database"
	"github.com/jphillips1313/portfolio-backend/internal/handlers"
	"github.com/jphillips1313/portfolio-backend/internals/models"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println(" No .env file found, using system environment")
	}

	// Connect to database
	db, err := database.ConnectDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName:      "Portfolio API v1.0",
		ErrorHandler: customErrorHandler,
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format:     "[${time}] ${status} - ${method} ${path} (${latency})\n",
		TimeFormat: "15:04:05",
		TimeZone:   "Local",
	}))
	app.Use(cors.New(cors.Config{
		AllowOrigins: os.Getenv("FRONTEND_URL"),
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// Health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		// Check database health
		dbStatus := "connected"
		if err := db.Health(); err != nil {
			dbStatus = "disconnected"
		}

		return c.JSON(models.HealthResponse{
			Status:      "ok",
			Message:     "Portfolio API is running",
			Database:    dbStatus,
			Timestamp:   time.Now().Format(time.RFC3339),
			Environment: os.Getenv("ENV"),
		})
	})

	// Database stats endpoint (useful for debugging)
	app.Get("/health/db", func(c *fiber.Ctx) error {
		stats := db.Stats()
		return c.JSON(fiber.Map{
			"open_connections": stats.OpenConnections,
			"in_use":           stats.InUse,
			"idle":             stats.Idle,
		})
	})

	// API routes will go here
	api := app.Group("/api/v1")

	//initialise handlers
	educationHandler := handlers.NewEducationHandler(db)
	projectsHandler := handlers.NewProjectsHandler(db)
	skillsHandler := handlers.NewSkillsHandler(db)
	blogHandler := handlers.NewBlogHandler(db)

	//Education routes
	api.Get("/education", educationHandler.GetAllEducation)
	api.Get("/education/:slug", educationHandler.GetEducationBySlug)
	api.Get("/education", educationHandler.CreateEducation) //TODO: Add Auth

	//Project routes
	api.Get("/projects", projectsHandler.GetAllProjects)
	api.Get("/projects:/slug", projectsHandler.GetProjectBySlug)
	api.Get("/projects", projectsHandler.CreateProject) //TODO: Add Auth

	//Skills routes
	api.Get("/skills", skillsHandler.GetAllSkills)

	//Blog Routes
	api.Get("/blog", blogHandler.GetAllBlogPosts)
	api.Get("/blog/:slug", blogHandler.GetBlogPostBySlug)

	//API info route
	api.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Portfolio API v1",
			"version": "1.0.0",
			"endpoints": []string{
				"GET /health",
				"GET /health/db",
				"GET /api/v1/education",
				"GET /api/v1/education/:slug",
				"GET /api/v1/projects",
				"GET /api/v1/projects/:slug",
				"GET /api/v1/skills",
				"GET /api/v1/blog",
				"GET /api/v1/blog/:slug",
			},
		})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	log.Printf("🚀 Server starting on port %s", port)
	log.Printf("📊 Environment: %s", os.Getenv("ENV"))
	log.Fatal(app.Listen(":" + port))
}

// Custom error handler
func customErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError

	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	}

	return c.Status(code).JSON(models.ErrorResponse{
		Error:   "error",
		Message: err.Error(),
		Code:    code,
	})
}
