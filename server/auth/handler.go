package auth

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"katanaid/database"
	"katanaid/shared"

	"github.com/jackc/pgx/v5/pgconn"
	"golang.org/x/crypto/bcrypt"
)

func Signup(w http.ResponseWriter, r *http.Request) {
	var req SignupRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Print("Error decoding JSON:", err)
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Something went wrong"})
		return
	}

	username := strings.TrimSpace(req.Username)
	email := strings.ToLower(strings.TrimSpace(req.Email)) // Normalize. No duplicate
	password := strings.TrimSpace(req.Password)

	if username == "" || email == "" || password == "" {
		log.Print("Request has empty field")
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Username, email and password required"})
		return
	}

	if len(username) < 3 {
		log.Print("Username length less than 3")
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Username must be at least 3 characters"})
		return
	} else if len(username) > 60 {
		log.Print("Username length exceeded 60")
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Username cannot exceed 60 characters"})
		return
	}

	if !shared.IsValidEmail(email) {
		log.Print("Invalid email format")
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Invalid email"})
		return
	}

	if len(password) < 8 {
		log.Print("Password length less than 8")
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Password must be at least 8 characters"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Print("Error generating password hash")
		shared.WriteJSON(w, http.StatusInternalServerError, shared.ErrorResponse{Error: "Something went wrong"})
		return
	}

	// Begin transaction, Signup rollback point
	ctx := r.Context()
	tx, err := database.DB.Begin(ctx)
	if err != nil {
		log.Print("Error starting transaction:", err)
		shared.WriteJSON(w, http.StatusInternalServerError, shared.ErrorResponse{Error: "Something went wrong"})
		return
	}
	defer tx.Rollback(ctx)

	var userID int
	err = tx.QueryRow(
		ctx,
		"INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
		username,
		email,
		string(hashedPassword),
	).Scan(&userID)

	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			switch pgErr.ConstraintName {
			case "users_email_key":
				shared.WriteJSON(w, http.StatusConflict, shared.ErrorResponse{Error: "Email already registered"})
			default:
				shared.WriteJSON(w, http.StatusConflict, shared.ErrorResponse{Error: "Account already registered"})
			}
			return
		}
		log.Print("Error creating account in DB:", err)
		shared.WriteJSON(w, http.StatusInternalServerError, shared.ErrorResponse{Error: "Something went wrong"})
		return
	}

	// Generate JWT
	tokenString, err := generateSignedToken(userID, username, email, false)
	if err != nil {
		log.Print("Error generating token for signup:", err)
		shared.WriteJSON(w, http.StatusInternalServerError, shared.ErrorResponse{Error: "Something went wrong"})
		return
	}

	// Generate email verification token
	rawEmailToken, hashedEmailToken, err := generateEmailVerificationToken()
	if err != nil {
		log.Print("Error generating token for email verification:", err)
		shared.WriteJSON(w, http.StatusInternalServerError, shared.ErrorResponse{Error: "Something went wrong"})
		return
	}

	_, err = tx.Exec(ctx,
		`INSERT INTO email_verifications (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
		userID, hashedEmailToken, time.Now().Add(24*time.Hour),
	)
	if err != nil {
		log.Print("Error storing email verification:", err)
		shared.WriteJSON(w, http.StatusInternalServerError, shared.ErrorResponse{Error: "Something went wrong"})
		return
	}

	err = sendVerificationEmail(rawEmailToken, email, username)
	if err != nil {
		log.Print("Error sending verification email:", err)
		shared.WriteJSON(w, http.StatusInternalServerError, shared.ErrorResponse{Error: "Something went wrong"})
		return
	}

	// Commit transaction
	err = tx.Commit(ctx)
	if err != nil {
		log.Print("Error committing transaction:", err)
		shared.WriteJSON(w, http.StatusInternalServerError, shared.ErrorResponse{Error: "Something went wrong"})
		return
	}

	log.Printf("New user signed up: %s - %s", username, email)

	shared.WriteJSON(w, http.StatusCreated, AuthSuccessResponse{
		Token:         tokenString,
		Username:      username,
		Email:         email,
		EmailVerified: false,
	})
}

func VerifyEmail(w http.ResponseWriter, r *http.Request) {
	frontendURL := os.Getenv("FRONTEND_URL")

	token := r.URL.Query().Get("token")
	if token == "" {
		http.Redirect(w, r, fmt.Sprintf("%s/auth/verified?error=missing_token", frontendURL), http.StatusTemporaryRedirect)
		return
	}

	userID, username, email, err := verifyToken(r.Context(), database.DB, token)
	if err != nil {
		http.Redirect(w, r, fmt.Sprintf("%s/auth/verified?error=invalid_token", frontendURL), http.StatusTemporaryRedirect)
		return
	}

	// Generate new JWT with email_verified: true
	jwtToken, err := generateSignedToken(userID, username, email, true)
	if err != nil {
		http.Redirect(w, r, fmt.Sprintf("%s/auth/verified?error=token_generation_failed", frontendURL), http.StatusTemporaryRedirect)
		return
	}

	log.Printf("User verified email: %s - %s", username, email)
	http.Redirect(w, r, fmt.Sprintf("%s/auth/verified?token=%s", frontendURL, jwtToken), http.StatusTemporaryRedirect)
}

func Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		log.Print("Error decoding JSON:", err)
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Something went wrong"})
		return
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))
	password := strings.TrimSpace(req.Password)

	if email == "" || password == "" {
		log.Print("Request has empty field")
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Email and password required"})
		return
	}

	var user User
	err = database.DB.QueryRow(
		context.Background(),
		"SELECT id, username, email, password_hash, email_verified FROM users WHERE email = $1",
		email,
	).Scan(&user.ID, &user.Username, &user.Email, &user.PasswordHash, &user.EmailVerified)

	if err != nil {
		log.Print("Incorrect username or password")
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Incorrect username or password"})
		return
	}

	// Notify user if user uses OAuth
	if strings.HasPrefix(user.PasswordHash, "oauth:") {
		parts := strings.Split(user.PasswordHash, ":")
		provider := "OAuth"
		if len(parts) >= 2 {
			provider = strings.Title(parts[1]) // Capitalize Google
		}
		log.Printf("OAuth user attempted password login: %s", email)
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: fmt.Sprintf("This account uses %s login", provider)})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		log.Print("Incorrect username or password")
		shared.WriteJSON(w, http.StatusBadRequest, shared.ErrorResponse{Error: "Incorrect username or password"})
		return
	}

	tokenString, err := generateSignedToken(user.ID, user.Username, user.Email, user.EmailVerified)
	if err != nil {
		log.Print("Error generating token for login:", err)
		shared.WriteJSON(w, http.StatusInternalServerError, shared.ErrorResponse{Error: "Something went wrong"})
		return
	}

	log.Printf("User logged in: %s - %s", user.Username, user.Email)
	shared.WriteJSON(w, http.StatusOK, AuthSuccessResponse{
		Token:         tokenString,
		Username:      user.Username,
		Email:         user.Email,
		EmailVerified: user.EmailVerified,
	})
}
