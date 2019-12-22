package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"

	_ "github.com/go-sql-driver/mysql" // import mysql
	"github.com/gorilla/mux"
)

type item struct {
	ItemID     string `json:"itemID"`
	MerchantID string `json:"merchantID"`
	Name       string `json:"name"`
}

// CreateItem create a item in the mysql db
func CreateItem(w http.ResponseWriter, r *http.Request) {

	// get the bearer token
	bearerHeader := r.Header.Get("Authorization")

	// validate token, it will return a User{UserID, Name}
	user, err := ValidateToken(bearerHeader)

	checkErr(err)

	// get the db connection
	db := getDBConn()

	// close db connection
	defer db.Close()

	var params item

	// decode the request parameters to item type
	err = json.NewDecoder(r.Body).Decode(&params)

	checkErr(err)

	// insert into the items db
	stmt, err := db.Prepare("INSERT INTO items SET itemID=?,merchantID=?,name=?")

	// close the stmt request
	defer stmt.Close()

	checkErr(err)

	// execute the insert statement
	res, err := stmt.Exec(params.ItemID, user.UserID, params.Name)

	checkErr(err)

	id, err := res.LastInsertId()

	checkErr(err)

	fmt.Println(id)

	// return the order created msg in json format
	json.NewEncoder(w).Encode("Item Created!")
}

// GetAllItems get all the items from the mysql db
func GetAllItems(w http.ResponseWriter, r *http.Request) {

	// get the bearer token
	bearerHeader := r.Header.Get("Authorization")

	// validate token, it will return a User{UserID, Name}
	_, err := ValidateToken(bearerHeader)

	checkErr(err)

	// create the db connection
	db := getDBConn()

	// close the db connection
	defer db.Close()

	// query
	rows, err := db.Query("SELECT * FROM items")

	checkErr(err)

	// create an array of item type to store all the items
	var items []item

	// iterate over rows to format item in item type
	for rows.Next() {
		var params item

		err = rows.Scan(&params.ItemID, &params.MerchantID, &params.Name)

		items = append(items, params)
	}

	// return the order array in json format
	json.NewEncoder(w).Encode(items)
}

// GetItem get item by item id
func GetItem(w http.ResponseWriter, r *http.Request) {

	// get the bearer token
	bearerHeader := r.Header.Get("Authorization")

	// validate token, it will return a User{UserID, Name}
	_, err := ValidateToken(bearerHeader)

	checkErr(err)

	// get all the params from the request
	vars := mux.Vars(r)

	// create the db connection
	db := getDBConn()

	// close db connection
	defer db.Close()

	// prepare query
	stmtOut, err := db.Prepare("SELECT * FROM items WHERE itemID=?")

	// close stmtOut request
	defer stmtOut.Close()

	checkErr(err)

	var item item

	err = stmtOut.QueryRow(vars["itemID"]).Scan(&item.ItemID, &item.MerchantID, &item.Name)

	checkErr(err)

	// return the order in json format
	json.NewEncoder(w).Encode(item)
}

// GetItemsByMerchant get all the items by Merchant
func GetItemsByMerchant(w http.ResponseWriter, r *http.Request) {

	// get the bearer token
	bearerHeader := r.Header.Get("Authorization")

	// validate token, it will return a User{UserID, Name}
	user, err := ValidateToken(bearerHeader)

	checkErr(err)

	// create the db connection
	db := getDBConn()

	// close db connection
	defer db.Close()

	// prepare query
	stmtOut, err := db.Prepare("SELECT * FROM items WHERE merchantID = ?")

	// close stmtOut request
	defer stmtOut.Close()

	checkErr(err)

	// filter orders by merchantID
	rows, err := stmtOut.Query(user.UserID)

	checkErr(err)

	// create an array of item type to store all the items
	var items []item

	// iterate over rows to format item in item type
	for rows.Next() {

		var item item

		err = rows.Scan(&item.ItemID, &item.MerchantID, &item.Name)

		items = append(items, item)
	}

	// return the item array in json format
	json.NewEncoder(w).Encode(items)

}
