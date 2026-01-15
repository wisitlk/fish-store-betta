package handlers

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// SaveUploadedFile saves a file to the upload directory and returns its relative URL
func SaveUploadedFile(file *multipart.FileHeader, c *gin.Context) (string, error) {
	// Create uploads directory if it doesn't exist
	uploadDir := "uploads"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		return "", err
	}

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%d_%s%s", time.Now().Unix(), uuid.New().String()[:8], ext)
	dst := filepath.Join(uploadDir, filename)

	// Save the file
	if err := c.SaveUploadedFile(file, dst); err != nil {
		return "", err
	}

	// Return web-accessible path
	// Assuming static files are served from /uploads
	return "/uploads/" + filename, nil
}

// UploadMedia handles direct media upload (if needed separately)
func UploadMedia(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(400, gin.H{"error": "No file uploaded"})
		return
	}

	path, err := SaveUploadedFile(file, c)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to save file"})
		return
	}

	c.JSON(200, gin.H{
		"url":  path,
		"type": getFileType(file.Filename),
	})
}

func getFileType(filename string) string {
	ext := strings.ToLower(filepath.Ext(filename))
	if ext == ".mp4" || ext == ".mov" || ext == ".webm" {
		return "video"
	}
	return "image"
}
