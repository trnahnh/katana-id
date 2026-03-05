package config

import (
	"log"
	"os"
)

var requiredEnvs = []string{
	"PORT",
	"DATABASE_URL",
	"JWT_SECRET",
	"GOOGLE_CLIENT_ID",
	"GOOGLE_CLIENT_SECRET",
	"GITHUB_CLIENT_ID",
	"GITHUB_CLIENT_SECRET",
	"RESEND_API_KEY",
	"FRONTEND_URL",
	"BACKEND_URL",
	"DEV_ENVIRONMENT",
	"GOOGLE_API_KEY",
}

func RequireEnvs() {
	for _, env := range requiredEnvs {
		if os.Getenv(env) == "" {
			log.Fatal("Missing required env:", env)
		}
	}
}