package handlers

import (
	"net/http"
	"strings"

	"trnahnh/aphroditehades/models"
	"trnahnh/aphroditehades/utils"

	"github.com/gin-gonic/gin"
)

type RegisterRequest struct {
	Email       string `json:"email" binding:"required,email"`
	Password    string `json:"password" binding:"required,min=8"`
	DisplayName string `json:"displayName" binding:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	AccessToken string       `json:"accessToken"`
	User        *models.User `json:"user"`
}

func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request: " + err.Error()})
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	req.DisplayName = strings.TrimSpace(req.DisplayName)

	user, err := models.CreateUser(req.Email, req.Password, req.DisplayName)
	if err != nil {
		if err == models.ErrEmailAlreadyExists {
			c.JSON(http.StatusConflict, gin.H{"message": "Email already registered"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create user"})
		return
	}

	token, err := utils.GenerateAccessToken(user.ID, user.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusCreated, AuthResponse{
		AccessToken: token,
		User:        user,
	})
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request: " + err.Error()})
		return
	}

	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	user, err := models.FindUserByEmail(req.Email)
	if err != nil {
		if err == models.ErrUserNotFound {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid email or password"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Login failed"})
		return
	}

	if !user.CheckPassword(req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid email or password"})
		return
	}

	token, err := utils.GenerateAccessToken(user.ID, user.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, AuthResponse{
		AccessToken: token,
		User:        &user.User,
	})
}

func GetMe(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Not authenticated"})
		return
	}

	c.JSON(http.StatusOK, user.(*models.User))
}

