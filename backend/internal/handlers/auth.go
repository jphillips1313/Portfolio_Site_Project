package handlers

import (
	"database/sql"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"

	"github.com/jphillips1313/portfolio-backend/internals/models"
)

type AuthHandler struct {
	db *sqlx.DB
}

func NewAuthHandler(db *sqlx.DB) *AuthHandler {
	return &AuthHandler{db: db}
}

// Login authenticates a login and assigns a JWT token
func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req models.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid Request Body",
		})
	}

	if req.Email == "" || req.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email and Password are required",
		})
	}

	// Basic email validation
	if !isValidEmail(req.Email) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid email format",
		})
	}

	//Find user by email
	var user models.User
	err := h.db.Get(&user, "SELECT * FROM users WHERE email = $1", req.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid credentials",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "database error",
		})
	}

	if !user.IsAdmin {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "access denied",
		})
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid Credentials",
		})
	}

	_, err = h.db.Exec("UPDATE users SET last_login = $1 WHERE id = $2", time.Now(), user.ID)
	if err != nil {
		//Log the error but not fail the login
		println("failed to update last_loginL", err.Error())
	}

	token, err := generateJWT(user)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate token",
		})
	}

	//Prepare response
	var response models.LoginResponse
	response.Token = token
	response.User.ID = user.ID
	response.User.Username = user.Username
	response.User.Email = user.Email
	response.User.IsAdmin = user.IsAdmin

	return c.JSON(response)
}

// Logout ivalidates the current session (client side token removal)
func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	//Could implement a token blacklist here
	return c.JSON(fiber.Map{
		"message": "Logged out successfully",
	})
}

func VerifyToken(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	println("DEBUG: Auth header received:", authHeader)
	if authHeader == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "No authorization header",
		})
	}

	tokenString := authHeader
	if len(authHeader) > 7 && (authHeader[:7] == "Bearer " || authHeader[:7] == "bearer ") {
		tokenString = authHeader[7:]
	}
	println("DEBUG: Token string after extraction:", tokenString[:20], "...")

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.NewError(fiber.StatusUnauthorized, "Invalid signing method")
		}
		return []byte(getJWTSecret()), nil
	})

	if err != nil || !token.Valid {
		println("DEBUG: Token parsing failed:", err.Error())
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid or expired token",
		})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid token claims",
		})
	}

	isAdmin, ok := claims["is_admin"].(bool)
	if !ok || !isAdmin {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Access denied",
		})
	}

	c.Locals("userID", claims["user_id"].(string))
	c.Locals("username", claims["username"].(string))
	c.Locals("isAdmin", isAdmin)

	return c.Next()
}

// helper functions
func generateJWT(user models.User) (string, error) {
	claims := jwt.MapClaims{
		"user_id":  user.ID.String(),
		"username": user.Username,
		"email":    user.Email,
		"is_admin": user.IsAdmin,
		"exp":      time.Now().Add(time.Hour * 24 * 7).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(getJWTSecret()))
}

func getJWTSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "your-super-secret-jwt-key-change-this-in-production"
	}
	return secret
}

// isValidEmail checks if email format is valid
func isValidEmail(email string) bool {
	// Simple email validation
	if len(email) < 3 || len(email) > 254 {
		return false
	}
	// Check for @ symbol
	atIndex := -1
	for i, char := range email {
		if char == '@' {
			if atIndex != -1 {
				return false // Multiple @ symbols
			}
			atIndex = i
		}
	}
	if atIndex == -1 || atIndex == 0 || atIndex == len(email)-1 {
		return false
	}
	// Check for dot after @
	dotAfterAt := false
	for i := atIndex + 1; i < len(email); i++ {
		if email[i] == '.' {
			dotAfterAt = true
			break
		}
	}
	return dotAfterAt
}

// ValidatePassword checks if password meets security requirements
func ValidatePassword(password string) error {
	if len(password) < 12 {
		return fiber.NewError(fiber.StatusBadRequest, "Password must be at least 12 characters long")
	}

	var (
		hasUpper   = false
		hasLower   = false
		hasNumber  = false
		hasSpecial = false
	)

	for _, char := range password {
		switch {
		case 'A' <= char && char <= 'Z':
			hasUpper = true
		case 'a' <= char && char <= 'z':
			hasLower = true
		case '0' <= char && char <= '9':
			hasNumber = true
		case char == '!' || char == '@' || char == '#' || char == '$' || char == '%' ||
			char == '^' || char == '&' || char == '*' || char == '(' || char == ')' ||
			char == '-' || char == '_' || char == '+' || char == '=' || char == '[' ||
			char == ']' || char == '{' || char == '}' || char == '|' || char == ';' ||
			char == ':' || char == ',' || char == '.' || char == '<' || char == '>' ||
			char == '?' || char == '/':
			hasSpecial = true
		}
	}

	if !hasUpper {
		return fiber.NewError(fiber.StatusBadRequest, "Password must contain at least one uppercase letter")
	}
	if !hasLower {
		return fiber.NewError(fiber.StatusBadRequest, "Password must contain at least one lowercase letter")
	}
	if !hasNumber {
		return fiber.NewError(fiber.StatusBadRequest, "Password must contain at least one number")
	}
	if !hasSpecial {
		return fiber.NewError(fiber.StatusBadRequest, "Password must contain at least one special character")
	}

	return nil
}
