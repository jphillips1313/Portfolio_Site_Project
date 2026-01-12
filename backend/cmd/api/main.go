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
	"github.com/jphillips1313/portfolio-backend/internal/middleware"
	"github.com/jphillips1313/portfolio-backend/internals/models"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment")
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
		AllowOrigins:     os.Getenv("FRONTEND_URL"),
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, PATCH, DELETE, OPTIONS",
		AllowCredentials: true,
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

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(db.DB)
	educationHandler := handlers.NewEducationHandler(db)
	projectsHandler := handlers.NewProjectsHandler(db)
	skillsHandler := handlers.NewSkillsHandler(db)
	blogHandler := handlers.NewBlogHandler(db)

	// API routes
	api := app.Group("/api/v1")

	// Public routes - Authentication
	auth := api.Group("/auth")
	// Apply rate limiting to login: max 5 attempts per 15 minutes
	loginRateLimit := middleware.RateLimit(middleware.RateLimitConfig{
		MaxRequests: 5,
		Window:      15 * time.Minute,
		BlockTime:   15 * time.Minute,
	})
	auth.Post("/login", loginRateLimit, authHandler.Login)
	auth.Post("/logout", authHandler.Logout)

	// Public routes - Read-only data
	api.Get("/education", educationHandler.GetAllEducation)
	api.Get("/education/:slug", educationHandler.GetEducationBySlug)
	api.Get("/projects", projectsHandler.GetAllProjects)
	api.Get("/projects/:slug", projectsHandler.GetProjectBySlug)
	api.Get("/skills", skillsHandler.GetAllSkills)
	api.Get("/blog", blogHandler.GetAllBlogPosts)
	api.Get("/blog/:slug", blogHandler.GetBlogPostBySlug)

	// Protected admin routes - require authentication
	admin := api.Group("/admin", handlers.VerifyToken)

	// Admin - Education management
	admin.Post("/education", educationHandler.CreateEducation)
	admin.Patch("/education/:id", educationHandler.Update)
	admin.Delete("/education/:id", educationHandler.Delete)

	// Admin - Module management
	admin.Post("/modules", educationHandler.CreateModule)
	admin.Patch("/modules/:id", educationHandler.UpdateModule)
	admin.Delete("/modules/:id", educationHandler.DeleteModule)

	// Admin - Skills management
	admin.Post("/skills", skillsHandler.Create)
	admin.Patch("/skills/:id", skillsHandler.Update)
	admin.Delete("/skills/:id", skillsHandler.Delete)

	// Admin - Projects management
	admin.Post("/projects", projectsHandler.CreateProject)
	admin.Patch("/projects/:id", projectsHandler.Update)
	admin.Delete("/projects/:id", projectsHandler.Delete)
	admin.Post("/projects/:id/upload-image", projectsHandler.UploadImage)

	// Admin - Blog management
	admin.Get("/blog", blogHandler.GetAllBlogPostsAdmin)
	admin.Post("/blog", blogHandler.CreateBlogPost)
	admin.Patch("/blog/:id", blogHandler.UpdateBlogPost)
	admin.Delete("/blog/:id", blogHandler.DeleteBlogPost)

	// API info route
	api.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Portfolio API v1",
			"version": "1.0.0",
			"endpoints": fiber.Map{
				"public": []string{
					"POST /api/v1/auth/login",
					"POST /api/v1/auth/logout",
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
				"admin": []string{
					"POST /api/v1/admin/education",
					"PATCH /api/v1/admin/education/:id",
					"DELETE /api/v1/admin/education/:id",
					"POST /api/v1/admin/modules",
					"PATCH /api/v1/admin/modules/:id",
					"DELETE /api/v1/admin/modules/:id",
					"POST /api/v1/admin/skills",
					"PATCH /api/v1/admin/skills/:id",
					"DELETE /api/v1/admin/skills/:id",
					"POST /api/v1/admin/projects",
					"PATCH /api/v1/admin/projects/:id",
					"DELETE /api/v1/admin/projects/:id",
					"POST /api/v1/admin/projects/:id/upload-image",
					"POST /api/v1/admin/blog",
					"PATCH /api/v1/admin/blog/:id",
					"DELETE /api/v1/admin/blog/:id",
				},
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
	log.Printf("🔐 Auth endpoints available at /api/v1/auth")
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
