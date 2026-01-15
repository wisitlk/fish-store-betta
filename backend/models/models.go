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

type Order struct {
	gorm.Model
	CustomerName    string `json:"customer_name"`
	CustomerEmail   string `json:"customer_email"`
	ShippingAddress string `json:"shipping_address"`
	Country         string `json:"country"`

	TranshipperID uint        `json:"transhipper_id"`
	Transhipper   Transhipper `json:"transhipper"`

	Items       []Product `gorm:"many2many:order_items;" json:"items"`
	TotalAmount float64   `json:"total_amount"`
	IsPaid      bool      `json:"is_paid"`
}
