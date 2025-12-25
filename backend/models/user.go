package models

import (
	"database/sql"
	"errors"
	"time"

	"trnahnh/aphroditehades/database"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID          uuid.UUID `json:"id"`
	Email       string    `json:"email"`
	DisplayName string    `json:"displayName"`
	AvatarURL   *string   `json:"avatarUrl,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type UserWithPassword struct {
	User
	PasswordHash sql.NullString
}

var (
	ErrUserNotFound       = errors.New("user not found")
	ErrEmailAlreadyExists = errors.New("email already exists")
	ErrInvalidCredentials = errors.New("invalid email or password")
)

func CreateUser(email, password, displayName string) (*User, error) {
	// Check if email exists
	var exists bool
	err := database.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", email).Scan(&exists)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, ErrEmailAlreadyExists
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Insert user
	var user User
	var avatarURL sql.NullString
	err = database.DB.QueryRow(`
		INSERT INTO users (email, password_hash, display_name)
		VALUES ($1, $2, $3)
		RETURNING id, email, display_name, avatar_url, created_at, updated_at
	`, email, string(hashedPassword), displayName).Scan(
		&user.ID, &user.Email, &user.DisplayName, &avatarURL, &user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	if avatarURL.Valid {
		user.AvatarURL = &avatarURL.String
	}

	return &user, nil
}

func FindUserByEmail(email string) (*UserWithPassword, error) {
	var user UserWithPassword
	var avatarURL sql.NullString

	err := database.DB.QueryRow(`
		SELECT id, email, password_hash, display_name, avatar_url, created_at, updated_at
		FROM users WHERE email = $1
	`, email).Scan(
		&user.ID, &user.Email, &user.PasswordHash, &user.DisplayName, &avatarURL, &user.CreatedAt, &user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, err
	}

	if avatarURL.Valid {
		user.AvatarURL = &avatarURL.String
	}

	return &user, nil
}

func FindUserByID(id uuid.UUID) (*User, error) {
	var user User
	var avatarURL sql.NullString

	err := database.DB.QueryRow(`
		SELECT id, email, display_name, avatar_url, created_at, updated_at
		FROM users WHERE id = $1
	`, id).Scan(
		&user.ID, &user.Email, &user.DisplayName, &avatarURL, &user.CreatedAt, &user.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, ErrUserNotFound
	}
	if err != nil {
		return nil, err
	}

	if avatarURL.Valid {
		user.AvatarURL = &avatarURL.String
	}

	return &user, nil
}

func (u *UserWithPassword) CheckPassword(password string) bool {
	if !u.PasswordHash.Valid {
		return false
	}
	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash.String), []byte(password))
	return err == nil
}

