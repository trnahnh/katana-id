-- +goose Up
CREATE TABLE captcha_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL UNIQUE,
    challenge_type VARCHAR(32) NOT NULL,
    expected_angle INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_captcha_session_id ON captcha_sessions(session_id);
CREATE INDEX idx_captcha_expires ON captcha_sessions(expires_at);

-- +goose Down
DROP INDEX IF EXISTS idx_captcha_expires;
DROP INDEX IF EXISTS idx_captcha_session_id;
DROP TABLE IF EXISTS captcha_sessions;