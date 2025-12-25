package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect(databaseURL string) error {
	var err error
	DB, err = sql.Open("postgres", databaseURL)
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}

	if err = DB.Ping(); err != nil {
		return fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("Connected to PostgreSQL database")
	return nil
}

func Migrate() error {
	query := `
	CREATE EXTENSION IF NOT EXISTS "pgcrypto";
	
	CREATE TABLE IF NOT EXISTS users (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		email VARCHAR(255) UNIQUE NOT NULL,
		password_hash VARCHAR(255),
		oauth_provider VARCHAR(50),
		oauth_id VARCHAR(255),
		display_name VARCHAR(100) NOT NULL,
		avatar_url TEXT,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW()
	);

	CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
	`

	_, err := DB.Exec(query)
	if err != nil {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	log.Println("Database migrations completed")
	return nil
}

func Close() {
	if DB != nil {
		DB.Close()
	}
}

