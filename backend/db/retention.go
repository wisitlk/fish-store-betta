package db

import (
	"log"
	"os"
	"strconv"
	"time"

	"aquatic-jewel/models"
)

// DefaultEventRetentionDays bounds how long raw behavioral events are kept.
// Aggregate figures (orders, customer totals) are unaffected by the purge.
const DefaultEventRetentionDays = 90

// EventRetentionDays reads EVENT_RETENTION_DAYS, falling back to the default.
// A value of 0 or less disables the purge entirely.
func EventRetentionDays() int {
	raw := os.Getenv("EVENT_RETENTION_DAYS")
	if raw == "" {
		return DefaultEventRetentionDays
	}
	days, err := strconv.Atoi(raw)
	if err != nil {
		log.Printf("invalid EVENT_RETENTION_DAYS %q, using %d", raw, DefaultEventRetentionDays)
		return DefaultEventRetentionDays
	}
	return days
}

// PurgeExpiredEvents deletes events older than the retention window and
// reports how many rows were removed.
func PurgeExpiredEvents() int64 {
	days := EventRetentionDays()
	if days <= 0 {
		return 0
	}

	cutoff := time.Now().AddDate(0, 0, -days)
	res := DB.Where("created_at < ?", cutoff).Delete(&models.Event{})
	if res.Error != nil {
		log.Printf("event retention purge failed: %v", res.Error)
		return 0
	}
	if res.RowsAffected > 0 {
		log.Printf("event retention: purged %d events older than %d days", res.RowsAffected, days)
	}
	return res.RowsAffected
}

// StartRetentionWorker purges once at boot and then daily.
func StartRetentionWorker() {
	if EventRetentionDays() <= 0 {
		log.Println("event retention disabled (EVENT_RETENTION_DAYS <= 0)")
		return
	}

	PurgeExpiredEvents()

	go func() {
		ticker := time.NewTicker(24 * time.Hour)
		defer ticker.Stop()
		for range ticker.C {
			PurgeExpiredEvents()
		}
	}()
}
