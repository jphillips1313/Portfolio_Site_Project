package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
)

type JSONB map[string]interface{}

// Scan implements sql.Scanner
func (j *JSONB) Scan(value interface{}) error {
	if value == nil {
		*j = nil
		return nil
	}

	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("failed to unmarshal JSONB value")
	}

	result := make(map[string]interface{})
	err := json.Unmarshal(bytes, &result)
	*j = result
	return err
}

// Value implements driver.Valuer
func (j JSONB) Value() (driver.Value, error) {
	if j == nil {
		return nil, nil
	}
	return json.Marshal(j)
}

type User struct {
	ID           uuid.UUID  `json:"id" db:"id"`
	Username     string     `json:"username" db:"username"`
	Email        string     `json:"email" db:"email"`
	PasswordHash string     `json:"-" db:"password_hash"` // Never send to client
	IsAdmin      bool       `json:"is_admin" db:"is_admin"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at" db:"updated_at"`
	LastLogin    *time.Time `json:"last_login,omitempty" db:"last_login"`
}

// LoginRequest represents login credentials
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  struct {
		ID       uuid.UUID `json:"id"`
		Username string    `json:"username"`
		Email    string    `json:"email"`
		IsAdmin  bool      `json:"is_admin"`
	} `json:"user"`
}

// Education represents a degree/qualification
type Education struct {
	ID           uuid.UUID  `db:"id" json:"id"`
	Degree       string     `db:"degree" json:"degree"`
	Institution  string     `db:"institution" json:"institution"`
	FieldOfStudy *string    `db:"field_of_study" json:"field_of_study"`
	StartDate    *time.Time `db:"start_date" json:"start_date"`
	EndDate      *time.Time `db:"end_date" json:"end_date"`
	Grade        *string    `db:"grade" json:"grade"`
	Description  *string    `db:"description" json:"description"`
	Slug         string     `db:"slug" json:"slug"`
	DisplayOrder int        `db:"display_order" json:"display_order"`
	CreatedAt    time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time  `db:"updated_at" json:"updated_at"`
	Modules      []Module   `db:"-" json:"modules,omitempty"` // Not a DB column, populated manually
}

// Module represents a course within a degree
type Module struct {
	ID              uuid.UUID `db:"id" json:"id"`
	EducationID     uuid.UUID `db:"education_id" json:"education_id"`
	Name            string    `db:"name" json:"name"`
	Code            *string   `db:"code" json:"code"`
	Grade           *string   `db:"grade" json:"grade"`
	Credits         *int      `db:"credits" json:"credits"`
	Semester        *string   `db:"semester" json:"semester"`
	Description     *string   `db:"description" json:"description"`
	DetailedContent JSONB     `db:"detailed_content" json:"detailed_content,omitempty"`
	DisplayOrder    int       `db:"display_order" json:"display_order"`
	CreatedAt       time.Time `db:"created_at" json:"created_at"`
	UpdatedAt       time.Time `db:"updated_at" json:"updated_at"`
}

// Skill represents a technical skill
type Skill struct {
	ID               uuid.UUID  `db:"id" json:"id"`
	Name             string     `db:"name" json:"name"`
	Category         *string    `db:"category" json:"category"`
	ProficiencyLevel *int       `db:"proficiency_level" json:"proficiency_level"`
	YearsExperience  *float64   `db:"years_experience" json:"years_experience"`
	Status           string     `db:"status" json:"status"`
	FirstLearnedDate *time.Time `db:"first_learned_date" json:"first_learned_date"`
	LastUsedDate     *time.Time `db:"last_used_date" json:"last_used_date"`
	Description      *string    `db:"description" json:"description"`
	Icon             *string    `db:"icon" json:"icon"`
	DisplayOrder     int        `db:"display_order" json:"display_order"`
	CreatedAt        time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt        time.Time  `db:"updated_at" json:"updated_at"`
}

// Project represents a portfolio project
type Project struct {
	ID               uuid.UUID  `db:"id" json:"id"`
	Name             string     `db:"name" json:"name"`
	Slug             string     `db:"slug" json:"slug"`
	ShortDescription *string    `db:"short_description" json:"short_description"`
	FullDescription  *string    `db:"full_description" json:"full_description"`
	Status           string     `db:"status" json:"status"`
	StartDate        *time.Time `db:"start_date" json:"start_date"`
	EndDate          *time.Time `db:"end_date" json:"end_date"`
	GithubURL        *string    `db:"github_url" json:"github_url"`
	LiveURL          *string    `db:"live_url" json:"live_url"`
	Featured         bool       `db:"featured" json:"featured"`
	DifficultyLevel  *string    `db:"difficulty_level" json:"difficulty_level"`
	ImageURL         *string    `db:"image_url" json:"image_url"`
	DemoVideoURL     *string    `db:"demo_video_url" json:"demo_video_url"`
	DisplayOrder     int        `db:"display_order" json:"display_order"`
	ViewCount        int        `db:"view_count" json:"view_count"`
	CreatedAt        time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt        time.Time  `db:"updated_at" json:"updated_at"`
}

type ProjectWithSkills struct {
	Project Project `json:"project"`
	Skills  []Skill `json:"skills"`
}

// BlogPost represents a blog article
type BlogPost struct {
	ID                 uuid.UUID  `db:"id" json:"id"`
	Title              string     `db:"title" json:"title"`
	Slug               string     `db:"slug" json:"slug"`
	Excerpt            *string    `db:"excerpt" json:"excerpt"`
	Content            string     `db:"content" json:"content"`
	Status             string     `db:"status" json:"status"`
	PublishedAt        *time.Time `db:"published_at" json:"published_at"`
	ReadingTimeMinutes *int       `db:"reading_time_minutes" json:"reading_time_minutes"`
	ViewCount          int        `db:"view_count" json:"view_count"`
	Featured           bool       `db:"featured" json:"featured"`
	Series             *string    `db:"series" json:"series"`
	SeriesOrder        *int       `db:"series_order" json:"series_order"`
	CoverImageURL      *string    `db:"cover_image_url" json:"cover_image_url"`
	CreatedAt          time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt          time.Time  `db:"updated_at" json:"updated_at"`
}

// HealthResponse for health check endpoint
type HealthResponse struct {
	Status      string `json:"status"`
	Message     string `json:"message"`
	Database    string `json:"database"`
	Timestamp   string `json:"timestamp"`
	Environment string `json:"environment"`
}

// ErrorResponse for API errors
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
	Code    int    `json:"code"`
}
