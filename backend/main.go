package main

import (
	"log"
	"os"

	"aquatic-jewel/db"
	_ "aquatic-jewel/docs" // Swagger docs
	"aquatic-jewel/handlers"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title Aquatic Jewel API
// @version 1.0
// @description API for managing unique Betta fish inventory and e-commerce operations
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.email support@aquaticjewel.com

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host localhost:8080
// @BasePath /api

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.

func main() {
	db.Init()
	r := gin.Default()

	// CORS
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000" // Default for local development
	}
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", frontendURL)
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Serve static files (uploads)
	r.Static("/uploads", "./uploads")

	// Swagger documentation
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	api := r.Group("/api")
	{
		// Public routes
		api.GET("/products", handlers.ListProducts)
		api.GET("/products/:id", handlers.GetProduct)
		api.GET("/transhippers", handlers.ListTranshippers)
		api.POST("/orders", handlers.CreateOrder)

		// Auth
		api.POST("/auth/google", handlers.VerifyGoogleToken)

		// Protected admin routes
		admin := api.Group("/admin")
		admin.Use(handlers.AuthMiddleware(), handlers.AdminOnly())
		{
			// Product Management
			admin.POST("/products", handlers.CreateProduct)
			admin.PUT("/products/:id", handlers.UpdateProduct)
			admin.PATCH("/products/:id/status", handlers.UpdateProductStatus) // New

			// User Management
			admin.GET("/users", handlers.ListUsers)
			admin.PUT("/users/:id/role", handlers.UpdateUserRole)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port for local development
	}
	log.Printf("Server starting on :%s", port)
	r.Run(":" + port)
}
