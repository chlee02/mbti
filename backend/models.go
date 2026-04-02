package main

import (
	"time"

	"gorm.io/gorm"
)

// Meme 데이터베이스 모델
type Meme struct {
	ID              uint           `json:"id" gorm:"primarykey"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"deleted_at" gorm:"index"`
	Type            string         `json:"type" gorm:"index"`
	URL             string         `json:"url"`
	Alt             string         `json:"alt"`
	Recommendations int            `json:"recommendations" gorm:"default:0"`
}
