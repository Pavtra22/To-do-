// package database

// import (
// 	"log"
// 	"path/filepath"

// 	 "github.com/glebarez/sqlite"
// 	"gorm.io/gorm"
// )

// var DB *gorm.DB

// func ConnectDB() {
// 	dbPath := filepath.Join("db", "todos.db")

// 	database, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
// 	if err != nil {
// 		log.Fatal("Failed to connect database: ", err)
// 	}

// 	DB = database
// }
package database

import (
	"fmt"
	"log"
	"path/filepath"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dbPath := filepath.Join("db", "todos.db")

	absPath, _ := filepath.Abs(dbPath)
	fmt.Println("Using SQLite DB file at:", absPath)

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	DB = db
}
