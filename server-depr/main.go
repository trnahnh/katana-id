package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"katanaid/auth"
	"katanaid/config"
	"katanaid/contact"
	"katanaid/database"
	"katanaid/health"
	"katanaid/identity"
	"katanaid/middleware"

	"github.com/joho/godotenv"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {
	godotenv.Load()
	config.RequireEnvs()

	database.Connect()
	defer database.Close()

	if err := auth.InitOAuth(); err != nil {
		log.Fatal("Failed to initialize OAuth:", err)
	}

	r := chi.NewRouter()

	allowedOrigins := []string{os.Getenv("FRONTEND_URL")}
	if os.Getenv("DEV_ENVIRONMENT") == "development" {
		allowedOrigins = append(allowedOrigins, os.Getenv("BACKEND_URL"))
	}

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   allowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/health", health.Health)

	r.Route("/auth", func(r chi.Router) {
		r.Use(middleware.RateLimiterPerMinute(20))
		r.Post("/signup", auth.Signup)
		r.Post("/login", auth.Login)
		r.Get("/google", auth.GoogleLogin)
		r.Get("/google/callback", auth.GoogleCallback)
		r.Get("/github", auth.GitHubLogin)
		r.Get("/github/callback", auth.GitHubCallback)
		r.Get("/verify-email", auth.VerifyEmail)
	})

	r.With(middleware.RateLimiterPerMinute(20)).Post("/api/contact", contact.Contact)

	r.Route("/api", func(r chi.Router) {
		r.Use(middleware.AuthMiddleware)
		r.Use(middleware.RateLimiterPerMinute(20))
		r.Post("/identity/username", identity.GenerateUsername)
		r.Post("/identity/avatar", identity.GenerateAvatar)
	})

	port := os.Getenv("PORT")
	fmt.Println("Server is starting on port", port)

	log.Fatal(http.ListenAndServe(":"+port, r))
}
