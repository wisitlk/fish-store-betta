package models

import (
	"time"

	"gorm.io/gorm"
)

type ProductStatus string

const (
	StatusDraft   ProductStatus = "Draft"
	StatusActive  ProductStatus = "Active"
	StatusPending ProductStatus = "Pending"
	StatusSold    ProductStatus = "Sold"
	StatusShipped ProductStatus = "Shipped"
)

type Product struct {
	ID        string         `gorm:"primaryKey" json:"id"`   // Internal UUID or similar
	SKU       string         `gorm:"uniqueIndex" json:"sku"` // e.g. BF-001
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`

	// Media
	MediaURLs string `json:"media_urls"` // JSON array of object {type: 'image'|'video', url: string}

	Status ProductStatus `json:"status" gorm:"default:'Draft'"`

	// Specs
	Breed          string `json:"breed"`
	Gender         string `json:"gender"`
	Size           string `json:"size"` // e.g. "M", "L", "XL" or "4.5cm"
	Age            string `json:"age"`  // e.g. "3.5 Months"
	ColorPattern   string `json:"color_pattern"`
	TranshipperFee bool   `json:"transhipper_fee"`
}

type Transhipper struct {
	ID      uint    `gorm:"primaryKey" json:"id"`
	Country string  `json:"country"`
	Name    string  `json:"name"`
	Fee     float64 `json:"fee"`
}

type User struct {
	gorm.Model
	Email    string `gorm:"uniqueIndex" json:"email"`
	GoogleID string `gorm:"uniqueIndex" json:"google_id"`
	Name     string `json:"name"`
	Role     string `json:"role" gorm:"default:'user'"` // 'user' or 'admin'
}

// Customer is a unified CDP profile assembled from storefront activity
// (checkout, newsletter signups, logins). Keyed by email.
type Customer struct {
	gorm.Model
	Email      string    `gorm:"uniqueIndex" json:"email"`
	Name       string    `json:"name"`
	Source     string    `json:"source"` // newsletter | checkout | google_login
	Country    string    `json:"country"`
	Consent    bool      `json:"consent"` // marketing consent (newsletter opt-in)
	OrderCount int       `json:"order_count"`
	TotalSpent float64   `json:"total_spent"`
	LastSeenAt time.Time `json:"last_seen_at"`
}

// Event is a raw behavioral event captured from the storefront.
type Event struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time `json:"created_at"`
	SessionID string    `gorm:"index;size:64" json:"session_id"`
	Email     string    `gorm:"index;size:255" json:"email"` // set once the visitor identifies
	Type      string    `gorm:"index;size:32" json:"type"`   // page_view | product_view | add_to_cart | checkout_started | purchase | newsletter_signup
	ProductID string    `gorm:"size:64" json:"product_id"`
	Path      string    `gorm:"size:255" json:"path"`
	Referrer  string    `gorm:"size:255" json:"referrer"`
	Metadata  string    `gorm:"size:1024" json:"metadata"` // free-form JSON
}

type Order struct {
	gorm.Model
	CustomerName    string `json:"customer_name"`
	CustomerEmail   string `json:"customer_email"`
	ShippingAddress string `json:"shipping_address"`
	Country         string `json:"country"`
	SessionID       string `gorm:"size:64" json:"session_id"` // analytics session for attribution

	TranshipperID uint        `json:"transhipper_id"`
	Transhipper   Transhipper `json:"transhipper"`

	Items       []Product `gorm:"many2many:order_items;" json:"items"`
	TotalAmount float64   `json:"total_amount"`
	IsPaid      bool      `json:"is_paid"`
}
