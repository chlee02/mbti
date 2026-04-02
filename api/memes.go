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

// Meme 구조체: 데이터베이스 테이블과 매핑됨
type Meme struct {
	ID              uint   `gorm:"primaryKey" json:"id"`
	Type            string `gorm:"column:type;index" json:"type"`
	URL             string `gorm:"column:url" json:"url"`
	Alt             string `gorm:"column:alt" json:"alt"`
	Recommendations int    `gorm:"column:recommendations;default:0" json:"recommendations"`
}

var db *gorm.DB

func init() {
	godotenv.Load(".env.local")
	var err error
	dsn := os.Getenv("POSTGRES_URL")
	if dsn == "" {
		// Fallback for local testing (SQLite)
		db, err = gorm.Open(sqlite.Open("mbti.db"), &gorm.Config{
			NamingStrategy: schema.NamingStrategy{SingularTable: true},
		})
	} else {
		// Production (Postgres)
		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			NamingStrategy: schema.NamingStrategy{SingularTable: true},
		})
	}

	if err != nil {
		fmt.Printf("Failed to connect to database: %v\n", err)
	}
	db.AutoMigrate(&Meme{})
}

func Memes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Path parsing: /api/memes/:type or /api/memes/:id/:action
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 3 {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}

	identifier := parts[2] // memes 뒤의 첫 번째 인자

	// Case 1: GET REQUESTS (MBTI Type or Featured)
	if r.Method == "GET" {
		if identifier == "featured" {
			// 오늘의 인기 밈 (랜덤)
			var memes []Meme
			db.Where("recommendations >= ?", 1).Order("RANDOM()").Limit(20).Find(&memes)
			json.NewEncoder(w).Encode(memes)
			return
		}

		// 특정 MBTI 타입 조회
		var memes []Meme
		db.Where("type = ?", identifier).Order("recommendations DESC").Find(&memes)
		json.NewEncoder(w).Encode(memes)
		return
	}

	// Case 2: POST REQUESTS (Recommend or Dislike)
	if r.Method == "POST" && len(parts) >= 4 {
		id := identifier
		action := parts[3]

		if action == "recommend" {
			db.Model(&Meme{}).Where("id = ?", id).UpdateColumn("recommendations", gorm.Expr("recommendations + ?", 1))
			json.NewEncoder(w).Encode(map[string]string{"message": "success"})
			return
		}
		if action == "dislike" {
			db.Model(&Meme{}).Where("id = ?", id).UpdateColumn("recommendations", gorm.Expr("recommendations - ?", 1))
			json.NewEncoder(w).Encode(map[string]string{"message": "success"})
			return
		}
	}

	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}
