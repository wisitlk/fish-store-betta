package db

import (
	"aquatic-jewel/models"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	_ "modernc.org/sqlite"
)

var DB *gorm.DB

func Init() {
	var err error
	var dialector gorm.Dialector

	// Check for PostgreSQL connection string (production)
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL != "" {
		log.Println("Using PostgreSQL database")
		dialector = postgres.Open(databaseURL)
	} else {
		log.Println("Using SQLite database")
		// Use pure Go SQLite driver for local development
		dialector = sqlite.Dialector{
			DriverName: "sqlite",
			DSN:        "aquatic.db",
		}
	}

	DB, err = gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	// Migrate the schema
	err = DB.AutoMigrate(&models.Product{}, &models.Order{}, &models.Transhipper{}, &models.User{})
	if err != nil {
		log.Fatal("failed to migrate database")
	}

	// Seed some initial data if empty
	seed()
}

func seed() {
	var productCount int64
	DB.Model(&models.Product{}).Count(&productCount)
	if productCount == 0 {
		products := []models.Product{
			{
				ID: "uuid-1", SKU: "BF-001", Name: "Red Dragon Halfmoon", Price: 45.00, Status: models.StatusActive,
				Breed: "Halfmoon", Description: "Vibrant red scales with white edges.",
				MediaURLs: "[{\"type\":\"image\",\"url\":\"https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&q=80\"}]",
				Age:       "3 Months",
			},
			{
				ID: "uuid-2", SKU: "BF-002", Name: "Blue Rim Plakat", Price: 65.00, Status: models.StatusActive,
				Breed: "Plakat", Description: "Clean white body with distinct blue rim.",
				MediaURLs: "[{\"type\":\"image\",\"url\":\"https://images.unsplash.com/photo-1544633769-433f4dd6d528?w=500&q=80\"}]",
				Age:       "4 Months",
			},
			{
				ID: "uuid-3", SKU: "BF-003", Name: "Black Samurai", Price: 120.00, Status: models.StatusSold,
				Breed: "Plakat", Description: "Rare full black scales with metallic layer.",
				MediaURLs: "[{\"type\":\"image\",\"url\":\"https://images.unsplash.com/photo-1534043464124-383240a27d3d?w=500&q=80\"}]",
				Age:       "3.5 Months",
			},
			{
				ID: "uuid-4", SKU: "BF-004", Name: "Galaxy Koi Female", Price: 35.00, Status: models.StatusActive,
				Breed: "HMPK", Description: "Multi-colored galaxy pattern.",
				MediaURLs: "[{\"type\":\"image\",\"url\":\"https://images.unsplash.com/photo-1598371839696-5c5bb352e260?w=500&q=80\"}]",
				Age:       "2.5 Months",
			},
		}
		DB.Create(&products)
	}

	var count int64
	DB.Model(&models.Transhipper{}).Count(&count)
	if count == 0 {
		DB.Create(&models.Transhipper{Country: "USA", Name: "Julie Tran (USA Transhipper)", Fee: 5.00})
		DB.Create(&models.Transhipper{Country: "UK", Name: "Aquatic Imports UK", Fee: 10.00})
		DB.Create(&models.Transhipper{Country: "Germany", Name: "Jan's Bettas", Fee: 8.00})
	}

	// Seed admin user for testing
	var adminCount int64
	DB.Model(&models.User{}).Where("role = ?", "admin").Count(&adminCount)
	if adminCount == 0 {
		// Create a default admin - in production, this should be done securely
		DB.Create(&models.User{
			Email:    "admin@aquaticjewel.com",
			GoogleID: "admin_default",
			Name:     "Admin User",
			Role:     "admin",
		})
	}
}
