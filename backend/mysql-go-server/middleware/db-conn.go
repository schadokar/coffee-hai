package middleware

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql" // import mysql
)

func getDBConn() *sql.DB {
	var err error

	// dbEndpoint := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8", os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_URL"), os.Getenv("DB_NAME"))

	dbEndpoint := "root:password@tcp(localhost:3306)/coffeedb?charset=utf8"

	db, err := sql.Open("mysql", dbEndpoint)

	checkErr(err)

	err = db.Ping()

	fmt.Println("DB Connected ")

	return db
}
