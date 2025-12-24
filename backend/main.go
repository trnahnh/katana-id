package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"passwordHash"`
}

// Placeholder storage
var users = make(map[string]string)

func main() {
	fmt.Print("Hello from the backend!")
	godotenv.Load()

	app := gin.Default()
	app.GET("/health", healthCheck)
	app.POST("/register", register)

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT is undefined")
	}

	app.Run(":" + port)
}

func register(c *gin.Context) {
	var user User
	err := c.BindJSON(&user)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid request"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error generating password hash"})
		return
	}
	users[user.Username] = string(hash)

	c.JSON(200, gin.H{"message": "Registered successfully"})
}

func healthCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "healthy",
	})
}
