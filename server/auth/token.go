package auth

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func generateSignedToken(userID int, username, email string, emailVerified bool) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":        userID,
		"username":       username,
		"email":          email,
		"email_verified": emailVerified,
		"iat":            time.Now().Unix(),
		"exp":            time.Now().Add(time.Hour * 24).Unix(),
	})
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func generateEmailVerificationToken() (raw string, hashed string, err error) {
	b := make([]byte, 64)
	if _, err := rand.Read(b); err != nil {
		return "", "", err
	}
	raw = hex.EncodeToString(b)

	h := sha256.Sum256([]byte(raw))
	hashed = hex.EncodeToString(h[:])

	return raw, hashed, nil
}

func findVerification(
	ctx context.Context,
	db *pgxpool.Pool,
	hashedToken string) (userID int, expiresAt time.Time, err error) {
	err = db.QueryRow(ctx,
		`SELECT user_id, expires_at FROM email_verifications WHERE token_hash = $1`,
		hashedToken,
	).Scan(&userID, &expiresAt)
	return
}

func deleteVerification(ctx context.Context, db *pgxpool.Pool, hashedToken string) error {
	_, err := db.Exec(ctx,
		`DELETE FROM email_verifications WHERE token_hash = $1`, hashedToken)
	return err
}

func verifyToken(ctx context.Context, db *pgxpool.Pool, incomingToken string) (int, string, string, error) {
	h := sha256.Sum256([]byte(incomingToken))
	hashedToken := hex.EncodeToString(h[:])

	userID, expiresAt, err := findVerification(ctx, db, hashedToken)
	if err != nil {
		return 0, "", "", errors.New("invalid token")
	}

	if time.Now().After(expiresAt) {
		_ = deleteVerification(ctx, db, hashedToken)
		return 0, "", "", errors.New("token expired")
	}

	_, err = db.Exec(ctx, `UPDATE users SET email_verified = TRUE WHERE id = $1`, userID)
	if err != nil {
		return 0, "", "", errors.New("failed to verify user")
	}

	// Fetch user info for JWT generation
	var username, email string
	err = db.QueryRow(ctx, `SELECT username, email FROM users WHERE id = $1`, userID).Scan(&username, &email)
	if err != nil {
		return 0, "", "", errors.New("failed to fetch user")
	}

	err = deleteVerification(ctx, db, hashedToken)
	if err != nil {
		return 0, "", "", err
	}

	return userID, username, email, nil
}
