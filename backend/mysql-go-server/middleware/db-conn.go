package middleware

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql" // import mysql package
	"github.com/joho/godotenv"         // import the godotenv package
)

func getDBConn() *sql.DB {

	// Load env variables using the godotenv package
	// DB details is saved as env variables
	err := godotenv.Load(".env")

	if err != nil {
		fmt.Println("Error loading .env file")
	}

	dbEndpoint := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8", os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_URL"), os.Getenv("DB_NAME"))

	//dbEndpoint := "root:password@tcp(localhost:3306)/coffeedb?charset=utf8"

	db, err := sql.Open("mysql", dbEndpoint)

	checkErr(err)

	err = db.Ping()

	fmt.Println("DB Connected ")

	return db
}
