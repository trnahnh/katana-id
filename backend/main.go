package main

import (
	"log"

	"trnahnh/aphroditehades/config"
	"trnahnh/aphroditehades/database"
	"trnahnh/aphroditehades/handlers"
	"trnahnh/aphroditehades/middleware"
	"trnahnh/aphroditehades/utils"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	godotenv.Load()

	// Load configuration
	cfg := config.Load()

	// Initialize JWT
	utils.InitJWT(cfg.JWTSecret)

	// Connect to database
	if err := database.Connect(cfg.DatabaseURL); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Run migrations
	if err := database.Migrate(); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	// Setup Gin router
	app := gin.Default()

	// CORS middleware
	app.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", cfg.FrontendURL)
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Health check
	app.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "healthy"})
	})

	// API v1 routes
	v1 := app.Group("/api/v1")
	{
		auth := v1.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
			auth.GET("/me", middleware.AuthRequired(), handlers.GetMe)
		}
	}

	// Start server
	log.Printf("Server starting on port %s", cfg.Port)
	if err := app.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
