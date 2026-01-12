package handlers

import (
	"fmt"
	"net/smtp"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type ContactHandler struct{}

func NewContactHandler() *ContactHandler {
	return &ContactHandler{}
}

type ContactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Subject string `json:"subject"`
	Message string `json:"message"`
}

// SendContactEmail handles contact form submissions
func (h *ContactHandler) SendContactEmail(c *fiber.Ctx) error {
	var req ContactRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate required fields
	if req.Name == "" || req.Email == "" || req.Subject == "" || req.Message == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "All fields are required",
		})
	}

	// Validate email format
	if !strings.Contains(req.Email, "@") {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid email address",
		})
	}

	// Get SMTP configuration from environment
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	smtpUser := os.Getenv("SMTP_USER")
	smtpPass := os.Getenv("SMTP_PASS")
	recipientEmail := os.Getenv("RECIPIENT_EMAIL")

	// If SMTP is not configured, return success but log it
	if smtpHost == "" || smtpPort == "" || smtpUser == "" || smtpPass == "" {
		fmt.Println("⚠️  SMTP not configured. Contact form submission received:")
		fmt.Printf("From: %s (%s)\n", req.Name, req.Email)
		fmt.Printf("Subject: %s\n", req.Subject)
		fmt.Printf("Message: %s\n", req.Message)

		return c.JSON(fiber.Map{
			"success": true,
			"message": "Message received! (Note: Email sending is not configured yet)",
		})
	}

	// Default recipient to SMTP user if not set
	if recipientEmail == "" {
		recipientEmail = smtpUser
	}

	// Compose email
	from := smtpUser
	to := []string{recipientEmail}

	// Email body with proper headers
	body := fmt.Sprintf(
		"From: %s\r\n"+
			"To: %s\r\n"+
			"Subject: Portfolio Contact: %s\r\n"+
			"MIME-Version: 1.0\r\n"+
			"Content-Type: text/plain; charset=UTF-8\r\n"+
			"\r\n"+
			"You have received a new contact form submission from your portfolio:\r\n\r\n"+
			"Name: %s\r\n"+
			"Email: %s\r\n"+
			"Subject: %s\r\n\r\n"+
			"Message:\r\n%s\r\n",
		from,
		recipientEmail,
		req.Subject,
		req.Name,
		req.Email,
		req.Subject,
		req.Message,
	)

	// Send email via SMTP
	auth := smtp.PlainAuth("", smtpUser, smtpPass, smtpHost)
	addr := fmt.Sprintf("%s:%s", smtpHost, smtpPort)

	err := smtp.SendMail(addr, auth, from, to, []byte(body))
	if err != nil {
		fmt.Printf("Failed to send email: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to send email. Please try again or contact directly at jackphillips1313@gmail.com",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Message sent successfully! I'll get back to you soon.",
	})
}
