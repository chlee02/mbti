package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

type Meme struct {
	gorm.Model
	Type string `json:"type"`
	URL  string `json:"url"`
	Alt  string `json:"alt"`
}

type StartIndexTracker struct {
	Type       string `gorm:"primaryKey"`
	StartIndex int
}

var db *gorm.DB

func init() {
	godotenv.Load(".env.local")
	var err error
	dsn := os.Getenv("POSTGRES_URL")
	if dsn == "" {
		// Fallback for local testing
		db, err = gorm.Open(sqlite.Open("mbti.db"), &gorm.Config{
			NamingStrategy: schema.NamingStrategy{
				SingularTable: true,
			},
		})
	} else {
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			NamingStrategy: schema.NamingStrategy{
				SingularTable: true,
			},
		})
	}

	if err != nil {
		fmt.Printf("Failed to connect to database: %v\n", err)
	}
	db.AutoMigrate(&Meme{}, &StartIndexTracker{})
}

func Memes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	// Example path: /api/memes/INTJ
	fmt.Printf("Request Path: %s\n", r.URL.Path)
	parts := strings.Split(r.URL.Path, "/")
	if len(parts) < 4 {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	mbtiType := parts[3]
	fmt.Printf("Extracted MBTI Type: %s\n", mbtiType)

	var memes []Meme
	result := db.Debug().Where("type = ?", mbtiType).Find(&memes)
	if result.Error != nil {
		fmt.Printf("Query Error: %v\n", result.Error)
		http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Printf("Found %d memes\n", len(memes))

	json.NewEncoder(w).Encode(memes)
}
