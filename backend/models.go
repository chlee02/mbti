package main

import (
	"time"

	"gorm.io/gorm"
)

// Meme 데이터베이스 모델
type Meme struct {
	ID              uint           `gorm:"primaryKey" json:"id"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `json:"deleted_at" gorm:"index"`
	Type            string         `gorm:"column:type;index" json:"type"`
	URL             string         `gorm:"column:url" json:"url"`
	Alt             string         `gorm:"column:alt" json:"alt"`
	Recommendations int            `gorm:"column:recommendations;default:0" json:"recommendations"`
}
