package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
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
