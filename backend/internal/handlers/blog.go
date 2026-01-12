package handlers

import (
	"database/sql"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jphillips1313/portfolio-backend/internal/database"
	"github.com/jphillips1313/portfolio-backend/internals/models"
)

type BlogHandler struct {
	db *database.Database
}

func NewBlogHandler(db *database.Database) *BlogHandler {
	return &BlogHandler{db: db}
}

// Get all blog published blog posts
func (h *BlogHandler) GetAllBlogPosts(c *fiber.Ctx) error {
	var posts []models.BlogPost

	query := `
	SELECT id, title, slug, excerpt, content, status, published_at,
	reading_time_minutes, view_count, featured, series, series_order,
	cover_image_url, created_at, updated_at
	FROM blog_posts
	WHERE status = 'published' AND published_at <= $1
	ORDER by published_at DESC
	`

	err := h.db.DB.Select(&posts, query, time.Now())
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   "database_error",
			Message: "failed to fetch database",
			Code:    500,
		})
	}

	// Ensure we return empty array instead of null
	if posts == nil {
		posts = []models.BlogPost{}
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    posts,
		"count":   len(posts),
	})
}

// Return a single blog post by slug
func (h *BlogHandler) GetBlogPostBySlug(c *fiber.Ctx) error {
	slug := c.Params("slug")

	var post models.BlogPost

	query := `
	SELECT id, title, slug, excerpt, content, status, published_at,
	reading_time_minutes, view_count, featured, series, series_order,
	cover_image_url, created_at, updated_at
	FROM blog_posts
	WHERE slug = $1 AND status = 'published'
	`

	err := h.db.DB.Get(&post, query, slug)
	if err != nil {
		return c.Status(404).JSON(models.ErrorResponse{
			Error:   "not_found",
			Message: "Blog post not found",
			Code:    404,
		})
	}

	h.db.DB.Exec("UPDATE blog_posts SET view_count + 1 WHERE id =$1", post.ID)

	return c.JSON(fiber.Map{
		"success": true,
		"data":    post,
	})
}

// GetAllBlogPostsAdmin returns ALL blog posts for admin (including drafts and unpublished)
func (h *BlogHandler) GetAllBlogPostsAdmin(c *fiber.Ctx) error {
	var posts []models.BlogPost

	query := `
	SELECT id, title, slug, excerpt, content, status, published_at,
	reading_time_minutes, view_count, featured, series, series_order,
	cover_image_url, created_at, updated_at
	FROM blog_posts
	ORDER BY created_at DESC
	`

	err := h.db.DB.Select(&posts, query)
	if err != nil {
		return c.Status(500).JSON(models.ErrorResponse{
			Error:   "database_error",
			Message: "failed to fetch database",
			Code:    500,
		})
	}

	// Ensure we return empty array instead of null
	if posts == nil {
		posts = []models.BlogPost{}
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    posts,
		"count":   len(posts),
	})
}

// Add these methods to your existing BlogHandler

// CreateBlogPost creates a new blog post
func (h *BlogHandler) CreateBlogPost(c *fiber.Ctx) error {
	var post models.BlogPost
	if err := c.BodyParser(&post); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate required fields
	if post.Title == "" || post.Content == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Title and content are required",
		})
	}

	// Generate slug if not provided
	if post.Slug == "" {
		post.Slug = generateSlug(post.Title)
	}

	// Auto-set published_at if status is published and no date is set
	if post.Status == "published" && post.PublishedAt == nil {
		now := time.Now()
		post.PublishedAt = &now
	}

	query := `
		INSERT INTO blog_posts (title, slug, excerpt, content, status, published_at,
			reading_time_minutes, featured, series, series_order, cover_image_url)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING *
	`

	err := h.db.DB.Get(&post, query,
		post.Title, post.Slug, post.Excerpt, post.Content, post.Status,
		post.PublishedAt, post.ReadingTimeMinutes, post.Featured,
		post.Series, post.SeriesOrder, post.CoverImageURL,
	)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create blog post",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"data":    post,
	})
}

// UpdateBlogPost updates a blog post
func (h *BlogHandler) UpdateBlogPost(c *fiber.Ctx) error {
	id := c.Params("id")

	postID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid blog post ID format",
		})
	}

	var updates map[string]interface{}
	if err := c.BodyParser(&updates); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Build dynamic UPDATE query
	query := "UPDATE blog_posts SET updated_at = CURRENT_TIMESTAMP"
	args := []interface{}{}
	argPosition := 1

	allowedFields := map[string]bool{
		"title": true, "slug": true, "excerpt": true, "content": true,
		"status": true, "published_at": true, "reading_time_minutes": true,
		"featured": true, "series": true, "series_order": true,
		"cover_image_url": true,
	}

	for field, value := range updates {
		if allowedFields[field] {
			query += fmt.Sprintf(", %s = $%d", field, argPosition)
			args = append(args, value)
			argPosition++
		}
	}

	query += fmt.Sprintf(" WHERE id = $%d RETURNING *", argPosition)
	args = append(args, postID)

	var post models.BlogPost
	err = h.db.DB.Get(&post, query, args...)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Blog post not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update blog post",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    post,
	})
}

// DeleteBlogPost deletes a blog post
func (h *BlogHandler) DeleteBlogPost(c *fiber.Ctx) error {
	id := c.Params("id")

	postID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid blog post ID format",
		})
	}

	result, err := h.db.DB.Exec("DELETE FROM blog_posts WHERE id = $1", postID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete blog post",
		})
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Blog post not found",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Blog post deleted successfully",
	})
}

// Helper function to generate slug from title
func generateSlug(title string) string {
	// Simple slug generation - lowercase and replace spaces with hyphens
	slug := strings.ToLower(title)
	slug = strings.ReplaceAll(slug, " ", "-")
	// Remove special characters (keep only alphanumeric and hyphens)
	reg := regexp.MustCompile("[^a-z0-9-]+")
	slug = reg.ReplaceAllString(slug, "")
	return slug
}
