package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

// 데이터베이스 연결 설정
func connectDatabase() {
	dsn := "root:12341234@tcp(127.0.0.1:3306)/mbti_db?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	log.Println("Database connected!")
	db.AutoMigrate(&Meme{})
}

// 메인 엔트리 포인트
func main() {
	// 데이터베이스 연결
	connectDatabase()

	// Gin 라우터 설정
	r := gin.Default()

	r.Use(cors.Default())

	// 기본 API 라우트
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	// MBTI 밈 라우트
	r.GET("/memes/:type", func(c *gin.Context) {
		mbtiType := c.Param("type")

		// 데이터베이스 쿼리 실행
		var memes []Meme
		result := db.Where("type = ?", mbtiType).Find(&memes)
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
			return
		}

		c.JSON(http.StatusOK, memes)
	})

	// 서버 실행
	r.Run(":8080")
}
