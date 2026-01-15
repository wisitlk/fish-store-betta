package handlers

import (
	"aquatic-jewel/db"
	"aquatic-jewel/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {
	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate Items are available
	// In a real scenario, use a transaction to lock rows
	tx := db.DB.Begin()
	
	var total float64
	for _, item := range order.Items {
		var p models.Product
		if err := tx.First(&p, "id = ? AND status = ?", item.ID, models.StatusActive).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusConflict, gin.H{"error": "Product " + item.ID + " is no longer available"})
			return
		}
		total += p.Price
		// Mark as Pending Payment
		p.Status = models.StatusPending
		tx.Save(&p)
	}

	// Add transhipper fee
	var transhipper models.Transhipper
	if err := tx.First(&transhipper, order.TranshipperID).Error; err == nil {
		total += transhipper.Fee
	}

	order.TotalAmount = total
	order.IsPaid = false // Pending payment integration
	
	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}
	
	tx.Commit()
	c.JSON(http.StatusCreated, order)
}

func ListTranshippers(c *gin.Context) {
	var list []models.Transhipper
	db.DB.Find(&list)
	c.JSON(http.StatusOK, list)
}
