package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/go-chi/httprate"
	"github.com/joho/godotenv"

	// "github.com/resend/resend-go/v3"
	"github.com/trnahnh/katana-id/internal/db"
	"github.com/trnahnh/katana-id/internal/health"
	"github.com/trnahnh/katana-id/util"
)

func main() {
	godotenv.Load()
	util.RequireEnvs()

	ctx := context.Background()
	_, pool, err := db.Connect(ctx, os.Getenv("DB_URL"))
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	// emailClient := resend.NewClient(os.Getenv("RESEND_API_KEY"))

	r	:= chi.NewRouter()

	r.Use(cors.Handler(util.CorsOptions()))
	r.Use(httprate.Limit(60, 1*time.Minute))

	r.Get("/health", health.Health)

	port := os.Getenv("PORT")
	log.Print("🍊 Server is starting on port ", port)
	if err := http.ListenAndServe(":"+port, r); err != nil {
		log.Fatal(err)
	}
}