package handlers

import (
	"aquatic-jewel/db"
	"aquatic-jewel/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// Simple token verification (placeholder - in production use proper JWT or session)
func VerifyGoogleToken(c *gin.Context) {
	var payload struct {
		Token string `json:"token"`
		Email string `json:"email"`
		Name  string `json:"name"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// In production: verify the token with Google's API
	// For now, we'll trust the frontend and create/update user
	
	var user models.User
	result := db.DB.Where("email = ?", payload.Email).First(&user)
	
	if result.Error != nil {
		// Create new user
		user = models.User{
			Email:    payload.Email,
			GoogleID: payload.Token, // In production, extract from verified token
			Name:     payload.Name,
			Role:     "user",
		}
		db.DB.Create(&user)
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
		"token": "session_" + user.Email, // Simple session token
	})
}

// Middleware to protect routes
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization required"})
			c.Abort()
			return
		}

		// Simple token check (in production use JWT)
		token := strings.TrimPrefix(authHeader, "Bearer ")
		if !strings.HasPrefix(token, "session_") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		email := strings.TrimPrefix(token, "session_")
		var user models.User
		if err := db.DB.Where("email = ?", email).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			c.Abort()
			return
		}

		c.Set("user", user)
		c.Next()
	}
}

// Admin-only middleware
func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		userVal, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
			c.Abort()
			return
		}

		user := userVal.(models.User)
		if user.Role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
			c.Abort()
			return
		}

		c.Next()
	}
}
