package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

// 데이터베이스 연결 설정
func connectDatabase() {
	// Root 디렉토리의 .env.local 로드 (현지 로컬 개발용)
	err := godotenv.Load("../.env.local")
	if err != nil {
		log.Println("Note: No .env.local file found, using production environment variables")
	}

	dsn := os.Getenv("POSTGRES_URL")
	if dsn == "" {
		log.Fatal("POSTGRES_URL environment variable is missing. Database access unavailable.")
	}

	log.Println("Connecting to database...")
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Critical: Failed to connect to database. URL format or permissions may be invalid. Error: %v", err)
	}

	sqlDB, _ := db.DB()
	if err := sqlDB.Ping(); err != nil {
		log.Fatal("Database is connected but not responding to PING")
	}

	log.Println("Database connection established successfully!")
	db.AutoMigrate(&Meme{})
}

// 메인 엔트리 포인트
func main() {
	// 데이터베이스 연결
	connectDatabase()

	// Gin 라우터 설정
	r := gin.Default()

	// CORS 설정
	r.Use(cors.Default())

	// 기본 핑 테스트
	r.Any("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	// 오늘의 인기 밈 (추천 1 이상, 랜덤)
	r.GET("/memes/featured", func(c *gin.Context) {
		var memes []Meme
		log.Println("Fetching featured memes...")
		result := db.Where("recommendations >= ?", 1).Order("RANDOM()").Limit(20).Find(&memes)
		if result.Error != nil {
			log.Printf("Error fetching featured memes: %v", result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}
		c.JSON(http.StatusOK, memes)
	})

	// MBTI 밈 라우트 (추천순 정렬)
	r.GET("/memes/:type", func(c *gin.Context) {
		mbtiType := c.Param("type")
		log.Printf("Fetching memes for type: %s", mbtiType)

		var memes []Meme
		result := db.Where("type = ?", mbtiType).Order("recommendations DESC, created_at DESC").Find(&memes)
		if result.Error != nil {
			log.Printf("Error fetching memes for %s: %v", mbtiType, result.Error)
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}
		c.JSON(http.StatusOK, memes)
	})

	// 추천수 증가 API
	r.POST("/memes/:id/recommend", func(c *gin.Context) {
		id := c.Param("id")
		if err := db.Model(&Meme{}).Where("id = ?", id).UpdateColumn("recommendations", gorm.Expr("recommendations + ?", 1)).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Recommended successfully"})
	})

	// 비추천수 증가 API
	r.POST("/memes/:id/dislike", func(c *gin.Context) {
		id := c.Param("id")
		if err := db.Model(&Meme{}).Where("id = ?", id).UpdateColumn("recommendations", gorm.Expr("recommendations - ?", 1)).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Disliked successfully"})
	})

	// 배포 환경 포트 설정
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server listening on :%s", port)
	r.Run(":" + port)
}
