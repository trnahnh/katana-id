package config

import (
	"os"
)

type Config struct {
	Port        string
	DatabaseURL string
	JWTSecret   string
	FrontendURL string
}

func Load() *Config {
	return &Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/aphrodite?sslmode=disable"),
		JWTSecret:   getEnv("JWT_SECRET", "your-super-secret-key-change-in-production"),
		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:5173"),
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}

