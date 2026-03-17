package main

import (
	"log"
	"mbti-backend/api"
	"github.com/joho/godotenv"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	godotenv.Load(".env.local")
	
	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/api/ping", func(c *gin.Context) {
		api.Ping(c.Writer, c.Request)
	})

	r.GET("/api/memes/:type", func(c *gin.Context) {
		api.Memes(c.Writer, c.Request)
	})

	log.Println("Local API server starting on :8080")
	r.Run(":8080")
}
