package main

import "gorm.io/gorm"

// Meme 데이터베이스 모델
type Meme struct {
	gorm.Model
	Type string `json:"type"`
	URL  string `json:"url"`
	Alt  string `json:"alt"`
}
