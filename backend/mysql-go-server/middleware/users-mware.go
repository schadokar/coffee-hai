package middleware

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	_ "github.com/go-sql-driver/mysql" // import mysql
)

// SignInMerchant SignIn merchant in the db if exist otherwise register and signin
func SignInMerchant(w http.ResponseWriter, r *http.Request) {

	// get db connection
	db := getDBConn()

	// close the db connection in the end
	defer db.Close()

	var user User

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		panic(errors.New("Unable to decode the request"))
	}

	// check if user exist

	// prepare the exist query
	stmtE, err := db.Prepare("SELECT EXISTS(SELECT * FROM merchant WHERE userID = ?)")

	// close stmtE request
	defer stmtE.Close()

	if err != nil {
		panic(errors.New("Error while preparing the select exists query"))
	}

	var exist int

	// execute the exist query
	err = stmtE.QueryRow(user.UserID).Scan(&exist)

	if err != nil {
		panic(errors.New("Error while executing the exists query"))
	}

	// check if user exist or not. 1 - exist | 0 - not exist
	if exist == 1 {
		// return the message in json format
		json.NewEncoder(w).Encode("User exist")
	} else {

		// prepare insert query to insert the merchant in the db
		stmt, err := db.Prepare("INSERT INTO merchant SET userID = ?, name = ?")

		// close the stmt request
		defer stmt.Close()

		if err != nil {
			panic(errors.New("Error while preparing the insert merchant query"))
		}

		// execute the insert statement
		_, err = stmt.Exec(user.UserID, user.Name)

		if err != nil {
			panic(errors.New("Error while executing the insert merchant query"))
		}

		fmt.Println()
		// return the message in json format
		json.NewEncoder(w).Encode("Merchant inserted successfully!")

	}

}

// SignInDelivery SignIn Delivery in the db if exist otherwise register and signin
func SignInDelivery(w http.ResponseWriter, r *http.Request) {

	// get db connection
	db := getDBConn()

	// close the db connection in the end
	defer db.Close()

	var user User

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		panic(errors.New("Unable to decode the request"))
	}

	// check if user exist

	// prepare the exist query
	stmtE, err := db.Prepare("SELECT EXISTS(SELECT * FROM delivery WHERE userID = ?)")

	// close stmtE request
	defer stmtE.Close()

	if err != nil {
		panic(errors.New("Error while preparing the select exists query"))
	}

	var exist int

	// execute the exist query
	err = stmtE.QueryRow(user.UserID).Scan(&exist)

	if err != nil {
		panic(errors.New("Error while executing the exists query"))
	}

	// check if user exist or not. 1 - exist | 0 - not exist
	if exist == 1 {
		// return the message in json format
		json.NewEncoder(w).Encode("User exist")
	} else {

		// prepare insert query to insert the delivery in the db
		stmt, err := db.Prepare("INSERT INTO delivery SET userID = ?, name = ?")

		// close the stmt request
		defer stmt.Close()

		if err != nil {
			panic(errors.New("Error while preparing the insert delivery query"))
		}

		// execute the insert statement
		_, err = stmt.Exec(user.UserID, user.Name)

		if err != nil {
			panic(errors.New("Error while executing the insert delivery query"))
		}

		fmt.Println()
		// return the message in json format
		json.NewEncoder(w).Encode("Delivery inserted successfully!")

	}

}

// SignInCustomer SignIn Customer in the db if exist otherwise register and signin
func SignInCustomer(w http.ResponseWriter, r *http.Request) {

	// get db connection
	db := getDBConn()

	// close the db connection in the end
	defer db.Close()

	var user User

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		panic(errors.New("Unable to decode the request"))
	}

	// check if user exist

	// prepare the exist query
	stmtE, err := db.Prepare("SELECT EXISTS(SELECT * FROM customer WHERE userID = ?)")

	// close stmtE request
	defer stmtE.Close()

	if err != nil {
		panic(errors.New("Error while preparing the select exists query"))
	}

	var exist int

	// execute the exist query
	err = stmtE.QueryRow(user.UserID).Scan(&exist)

	if err != nil {
		panic(errors.New("Error while executing the exists query"))
	}

	// check if user exist or not. 1 - exist | 0 - not exist
	if exist == 1 {
		// return the message in json format
		json.NewEncoder(w).Encode("User exist")
	} else {

		// prepare insert query to insert the customer in the db
		stmt, err := db.Prepare("INSERT INTO customer SET userID = ?, name = ?")

		// close the stmt request
		defer stmt.Close()

		if err != nil {
			panic(errors.New("Error while preparing the insert customer query"))
		}

		// execute the insert statement
		_, err = stmt.Exec(user.UserID, user.Name)

		if err != nil {
			panic(errors.New("Error while executing the insert customer query"))
		}

		fmt.Println()
		// return the message in json format
		json.NewEncoder(w).Encode("Customer inserted successfully!")

	}

}
