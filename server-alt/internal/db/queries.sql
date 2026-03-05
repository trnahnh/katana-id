-- name: CreateUser :one
INSERT INTO users (username, email)
VALUES ($1, $2)
RETURNING *;

-- name: CreateOTP :exec
INSERT INTO otps (email, otp, expires_at)
VALUES ($1, $2, $3);

-- name: CreateSession :one
INSERT INTO sessions (email, expires_at)
VALUES ($1, $2)
RETURNING *;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1 LIMIT 1;

-- name: GetOTPByEmail :one
SELECT * FROM otps WHERE email = $1 AND expires_at > NOW() ORDER BY expires_at DESC LIMIT 1;

-- name: DeleteOTPsByEmail :exec
DELETE FROM otps WHERE email = $1;

-- name: CreateProvider :one
INSERT INTO providers (user_id, provider_name, provider_account_id)
VALUES ($1, $2, $3)
RETURNING *;