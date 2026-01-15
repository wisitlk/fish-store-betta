package handlers

import (
	"aquatic-jewel/db"
	"aquatic-jewel/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ListUsers returns all users (Admin only)
func ListUsers(c *gin.Context) {
	var users []models.User
	// Basic pagination could be added here
	if err := db.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	c.JSON(http.StatusOK, users)
}

// UpdateUserRole changes a user's role (Admin only)
func UpdateUserRole(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Role string `json:"role"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Role != "user" && req.Role != "admin" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role"})
		return
	}

	if err := db.DB.Model(&models.User{}).Where("id = ?", id).Update("role", req.Role).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update role"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Role updated successfully", "role": req.Role})
}
