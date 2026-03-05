package util

import (
	"log"
	"os"
)

func RequireEnvs() {
	envs := []string{
		"DB_URL",
		"PORT",
		"RESEND_API_KEY",
	}

	for _, env := range envs {
		if os.Getenv(env) == "" {
			log.Fatal("Missing required env: ", env)
		}
	}
}