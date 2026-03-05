package auth

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"os"
	"time"

	"katanaid/database"
	"katanaid/database/ent/emailverification"

	"github.com/golang-jwt/jwt/v5"
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

func verifyToken(ctx context.Context, incomingToken string) (int, string, string, error) {
	h := sha256.Sum256([]byte(incomingToken))
	hashedToken := hex.EncodeToString(h[:])

	ev, err := database.Client.EmailVerification.Query().
		Where(emailverification.TokenHashEQ(hashedToken)).
		WithUser().
		Only(ctx)
	if err != nil {
		return 0, "", "", errors.New("invalid token")
	}

	u, err := ev.Edges.UserOrErr()
	if err != nil {
		return 0, "", "", errors.New("invalid token")
	}

	if time.Now().After(ev.ExpiresAt) {
		database.Client.EmailVerification.DeleteOne(ev).Exec(ctx)
		return 0, "", "", errors.New("token expired")
	}

	_, err = database.Client.User.UpdateOneID(u.ID).
		SetEmailVerified(true).
		Save(ctx)
	if err != nil {
		return 0, "", "", errors.New("failed to verify user")
	}

	database.Client.EmailVerification.DeleteOne(ev).Exec(ctx)

	return u.ID, u.Username, u.Email, nil
}
