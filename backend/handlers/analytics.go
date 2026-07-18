package handlers

import (
	"net/http"
	"time"

	"aquatic-jewel/db"
	"aquatic-jewel/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var allowedEventTypes = map[string]bool{
	"page_view":         true,
	"product_view":      true,
	"add_to_cart":       true,
	"checkout_started":  true,
	"purchase":          true,
	"newsletter_signup": true,
	"search":            true,
}

func truncate(s string, max int) string {
	if len(s) > max {
		return s[:max]
	}
	return s
}

type trackRequest struct {
	SessionID string `json:"session_id" binding:"required"`
	Type      string `json:"type" binding:"required"`
	Email     string `json:"email"`
	ProductID string `json:"product_id"`
	Path      string `json:"path"`
	Referrer  string `json:"referrer"`
	Metadata  string `json:"metadata"`
}

// TrackEvent godoc
// @Summary Record a storefront behavioral event
// @Tags analytics
// @Accept json
// @Produce json
// @Param event body trackRequest true "Event"
// @Success 202 {object} map[string]bool
// @Router /track [post]
func TrackEvent(c *gin.Context) {
	var req trackRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if !allowedEventTypes[req.Type] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "unknown event type"})
		return
	}

	event := models.Event{
		SessionID: truncate(req.SessionID, 64),
		Email:     truncate(req.Email, 255),
		Type:      req.Type,
		ProductID: truncate(req.ProductID, 64),
		Path:      truncate(req.Path, 255),
		Referrer:  truncate(req.Referrer, 255),
		Metadata:  truncate(req.Metadata, 1024),
	}
	if err := db.DB.Create(&event).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to record event"})
		return
	}

	// Keep the customer's last-seen timestamp fresh for identified visitors.
	if event.Email != "" {
		db.DB.Model(&models.Customer{}).
			Where("email = ?", event.Email).
			Update("last_seen_at", time.Now())
	}

	c.JSON(http.StatusAccepted, gin.H{"ok": true})
}

// UpsertCustomer creates or refreshes a CDP profile keyed by email.
// orderAmount > 0 also increments purchase totals. Runs on the given tx so
// order creation stays atomic.
func UpsertCustomer(tx *gorm.DB, email, name, country, source string, consent bool, orderAmount float64) models.Customer {
	var customer models.Customer
	err := tx.Where("email = ?", email).First(&customer).Error
	if err == gorm.ErrRecordNotFound {
		customer = models.Customer{
			Email:   email,
			Name:    name,
			Country: country,
			Source:  source,
			Consent: consent,
		}
	} else if err != nil {
		return customer
	}

	if name != "" {
		customer.Name = name
	}
	if country != "" {
		customer.Country = country
	}
	if consent {
		customer.Consent = true
	}
	if orderAmount > 0 {
		customer.OrderCount++
		customer.TotalSpent += orderAmount
	}
	customer.LastSeenAt = time.Now()
	tx.Save(&customer)
	return customer
}

type leadRequest struct {
	Email   string `json:"email" binding:"required,email"`
	Name    string `json:"name"`
	Source  string `json:"source"`
	Consent bool   `json:"consent"`
	Session string `json:"session_id"`
}

// CreateLead godoc
// @Summary Capture a lead (newsletter signup or similar) into the customer store
// @Tags analytics
// @Accept json
// @Produce json
// @Param lead body leadRequest true "Lead"
// @Success 201 {object} models.Customer
// @Router /leads [post]
func CreateLead(c *gin.Context) {
	var req leadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.Source == "" {
		req.Source = "newsletter"
	}

	customer := UpsertCustomer(db.DB, req.Email, req.Name, "", req.Source, req.Consent, 0)

	db.DB.Create(&models.Event{
		SessionID: truncate(req.Session, 64),
		Email:     truncate(req.Email, 255),
		Type:      "newsletter_signup",
	})

	c.JSON(http.StatusCreated, customer)
}

type funnelStep struct {
	Type     string `json:"type"`
	Count    int64  `json:"count"`
	Sessions int64  `json:"sessions"`
}

type topProduct struct {
	ProductID string `json:"product_id"`
	Name      string `json:"name"`
	Views     int64  `json:"views"`
	Carts     int64  `json:"carts"`
}

// AnalyticsSummary godoc
// @Summary Aggregated sales and behavior metrics for the admin dashboard
// @Tags analytics
// @Produce json
// @Security BearerAuth
// @Success 200 {object} map[string]interface{}
// @Router /admin/analytics [get]
func AnalyticsSummary(c *gin.Context) {
	var revenue float64
	db.DB.Model(&models.Order{}).Select("COALESCE(SUM(total_amount), 0)").Scan(&revenue)

	var orderCount int64
	db.DB.Model(&models.Order{}).Count(&orderCount)

	var customerCount int64
	db.DB.Model(&models.Customer{}).Count(&customerCount)

	var subscriberCount int64
	db.DB.Model(&models.Customer{}).Where("consent = ?", true).Count(&subscriberCount)

	// Conversion funnel: unique sessions per step, in journey order.
	funnelOrder := []string{"page_view", "product_view", "add_to_cart", "checkout_started", "purchase"}
	funnel := make([]funnelStep, 0, len(funnelOrder))
	for _, t := range funnelOrder {
		var count, sessions int64
		db.DB.Model(&models.Event{}).Where("type = ?", t).Count(&count)
		db.DB.Model(&models.Event{}).Where("type = ?", t).Distinct("session_id").Count(&sessions)
		funnel = append(funnel, funnelStep{Type: t, Count: count, Sessions: sessions})
	}

	// Most-viewed products with add-to-cart counts.
	var top []topProduct
	db.DB.Raw(`
		SELECT e.product_id,
		       COALESCE(p.name, e.product_id) AS name,
		       SUM(CASE WHEN e.type = 'product_view' THEN 1 ELSE 0 END) AS views,
		       SUM(CASE WHEN e.type = 'add_to_cart' THEN 1 ELSE 0 END) AS carts
		FROM events e
		LEFT JOIN products p ON p.id = e.product_id
		WHERE e.product_id <> ''
		GROUP BY e.product_id, p.name
		ORDER BY views DESC
		LIMIT 10
	`).Scan(&top)

	var recent []models.Event
	db.DB.Order("created_at DESC").Limit(25).Find(&recent)

	c.JSON(http.StatusOK, gin.H{
		"revenue":     revenue,
		"orders":      orderCount,
		"customers":   customerCount,
		"subscribers": subscriberCount,
		"funnel":      funnel,
		"top_products": top,
		"recent_events": recent,
	})
}

// ListCustomers godoc
// @Summary List CDP customer profiles
// @Tags analytics
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.Customer
// @Router /admin/customers [get]
func ListCustomers(c *gin.Context) {
	var customers []models.Customer
	db.DB.Order("total_spent DESC, last_seen_at DESC").Find(&customers)
	c.JSON(http.StatusOK, customers)
}
