package middleware

import (
	"strings"

	"trnahnh/aphroditehades/models"
	"trnahnh/aphroditehades/utils"

	"github.com/gin-gonic/gin"
)

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(401, gin.H{"message": "Authorization header required"})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(401, gin.H{"message": "Invalid authorization header format"})
			c.Abort()
			return
		}

		claims, err := utils.ValidateToken(parts[1])
		if err != nil {
			c.JSON(401, gin.H{"message": "Invalid or expired token"})
			c.Abort()
			return
		}

		user, err := models.FindUserByID(claims.UserID)
		if err != nil {
			c.JSON(401, gin.H{"message": "User not found"})
			c.Abort()
			return
		}

		c.Set("user", user)
		c.Next()
	}
}

