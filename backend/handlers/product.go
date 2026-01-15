package handlers

import (
	"aquatic-jewel/db"
	"aquatic-jewel/models"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ListProducts godoc
// @Summary List all products
// @Description Get a list of all products, optionally filtered by status
// @Tags products
// @Accept json
// @Produce json
// @Param status query string false "Filter by status (Active, Sold, Draft, ALL)"
// @Success 200 {array} models.Product
// @Router /products [get]
func ListProducts(c *gin.Context) {
	status := c.Query("status")
	var products []models.Product

	query := db.DB
	if status != "" && status != "ALL" {
		query = query.Where("status = ?", status)
	}

	// Default to not showing deleted
	query.Find(&products)
	c.JSON(http.StatusOK, products)
}

// GetProduct godoc
// @Summary Get a product by ID
// @Description Get detailed information about a specific product
// @Tags products
// @Accept json
// @Produce json
// @Param id path string true "Product ID"
// @Success 200 {object} models.Product
// @Failure 404 {object} map[string]string
// @Router /products/{id} [get]
func GetProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	if result := db.DB.First(&product, "id = ?", id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, product)
}

// CreateProduct handles multipart/form-data for image/video upload
func CreateProduct(c *gin.Context) {
	// Parse form fields
	name := c.PostForm("name")
	sku := c.PostForm("sku")
	priceStr := c.PostForm("price")
	description := c.PostForm("description")
	breed := c.PostForm("breed")
	gender := c.PostForm("gender")
	size := c.PostForm("size")
	age := c.PostForm("age")
	colorPattern := c.PostForm("color_pattern")

	if name == "" || sku == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name and SKU are required"})
		return
	}

	price, _ := strconv.ParseFloat(priceStr, 64)

	// Handle File Uploads
	form, _ := c.MultipartForm()
	files := form.File["files"] // Expects multiple files with key "files"

	var mediaList []map[string]string

	for _, file := range files {
		path, err := SaveUploadedFile(file, c)
		if err == nil {
			mediaType := "image"
			if getFileType(file.Filename) == "video" {
				mediaType = "video"
			}
			mediaList = append(mediaList, map[string]string{
				"type": mediaType,
				"url":  path,
			})
		}
	}

	mediaJSON, _ := json.Marshal(mediaList)

	product := models.Product{
		ID:           uuid.New().String(),
		SKU:          sku,
		Name:         name,
		Description:  description,
		Price:        price,
		Status:       models.StatusDraft,
		Breed:        breed,
		Gender:       gender,
		Size:         size,
		Age:          age,
		ColorPattern: colorPattern,
		MediaURLs:    string(mediaJSON),
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := db.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	c.JSON(http.StatusCreated, product)
}

// UpdateProductStatus allows quick toggling (e.g. Draft -> Active -> Sold)
func UpdateProductStatus(c *gin.Context) {
	id := c.Param("id")
	var req struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	validStatuses := map[string]bool{
		string(models.StatusDraft):  true,
		string(models.StatusActive): true,
		string(models.StatusSold):   true,
	}

	if !validStatuses[req.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status"})
		return
	}

	if err := db.DB.Model(&models.Product{}).Where("id = ?", id).Update("status", req.Status).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status updated", "status": req.Status})
}

func UpdateProduct(c *gin.Context) {
	// reuse existing logic or implement similar to create but for update
	// for brevity, keeping simple update for now
	id := c.Param("id")
	var product models.Product
	if result := db.DB.First(&product, "id = ?", id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var updateData models.Product
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.DB.Model(&product).Updates(updateData)
	c.JSON(http.StatusOK, product)
}
