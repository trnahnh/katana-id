package models

type User struct {
	ID            int
	Username      string
	Email         string
	PasswordHash  string
	EmailVerified bool
}

type SignupRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Shared by both login and signup
type AuthSuccessResponse struct {
	Token         string `json:"token"`
	Username      string `json:"username"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}