package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"

	_ "github.com/go-sql-driver/mysql" // import mysql
	"github.com/gorilla/mux"
)

type order struct {
	OrderID     string `json:"orderID"`
	MerchantID  string `json:"merchantID"`
	DeliveryID  string `json:"deliveryID"`
	CustomerID  string `json:"customerID"`
	OrderStatus string `json:"orderStatus"`
}

var user map[string]interface{}

// CreateOrder create order in the mysql db
func CreateOrder(w http.ResponseWriter, r *http.Request) {

	// get the bearer token
	bearerHeader := r.Header.Get("Authorization")

	// validate token, it will return a User{UserID, Name}
	_, err := ValidateToken(bearerHeader)

	checkErr(err)

	// get the db connection
	db := getDBConn()

	// close db connection
	defer db.Close()

	var params order

	// decode the request parameters to order type
	err = json.NewDecoder(r.Body).Decode(&params)

	checkErr(err)

	// insert into the orders db
	stmt, err := db.Prepare("INSERT INTO orders SET orderID=?,merchantID=?,deliveryID=?, customerID=?, orderStatus=?")

	// close the stmt request
	defer stmt.Close()

	checkErr(err)

	// execute the insert statement
	res, err := stmt.Exec(params.OrderID, params.MerchantID, params.DeliveryID, params.CustomerID, params.OrderStatus)

	checkErr(err)

	id, err := res.LastInsertId()

	checkErr(err)

	fmt.Println(id)

	// return the order created msg in json format
	json.NewEncoder(w).Encode("Order Created!")
}

// GetAllOrders get all the orders from mysql db
func GetAllOrders(w http.ResponseWriter, r *http.Request) {

	// get the bearer token
	bearerHeader := r.Header.Get("Authorization")

	// validate token, it will return a User{UserID, Name}
	_, err := ValidateToken(bearerHeader)

	checkErr(err)

	// create the db connection
	db := getDBConn()

	// close db connection
	defer db.Close()

	// query
	rows, err := db.Query("SELECT * FROM orders")

	checkErr(err)

	// create an array of order type to store all the orders
	var orders []order

	// iterate over rows to format order in order type
	for rows.Next() {
		var params order

		err = rows.Scan(&params.OrderID, &params.MerchantID, &params.DeliveryID, &params.CustomerID, &params.OrderStatus)

		orders = append(orders, params)
	}

	// return the order array in json format
	json.NewEncoder(w).Encode(orders)

}

// GetOrder get order by id
func GetOrder(w http.ResponseWriter, r *http.Request) {

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
	stmtOut, err := db.Prepare("SELECT * FROM orders WHERE orderID = ?")

	// close stmtOut request
	defer stmtOut.Close()

	checkErr(err)

	var order order

	err = stmtOut.QueryRow(vars["orderID"]).Scan(&order.OrderID, &order.MerchantID, &order.DeliveryID, &order.CustomerID, &order.OrderStatus)

	checkErr(err)

	// return the order in json format
	json.NewEncoder(w).Encode(order)

}

// GetOrdersByStatus get all the orders by status
func GetOrdersByStatus(w http.ResponseWriter, r *http.Request) {

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
	stmtOut, err := db.Prepare("SELECT * FROM orders WHERE orderStatus = ?")

	// close stmtOut request
	defer stmtOut.Close()

	checkErr(err)

	// filter orders by orderStatus
	rows, err := stmtOut.Query(vars["orderStatus"])

	checkErr(err)

	// create an array of order type to store all the orders
	var orders []order

	// iterate over rows to format order in order type
	for rows.Next() {

		var order order

		err = rows.Scan(&order.OrderID, &order.MerchantID, &order.DeliveryID, &order.CustomerID, &order.OrderStatus)

		orders = append(orders, order)
	}

	// return the order array in json format
	json.NewEncoder(w).Encode(orders)

}

// GetOrdersByMerchant get all the orders by Merchant
func GetOrdersByMerchant(w http.ResponseWriter, r *http.Request) {

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
	stmtOut, err := db.Prepare("SELECT * FROM orders WHERE merchantID = ?")

	// close stmtOut request
	defer stmtOut.Close()

	checkErr(err)

	// filter orders by merchantID
	rows, err := stmtOut.Query(user.UserID)

	checkErr(err)

	// create an array of order type to store all the orders
	var orders []order

	// iterate over rows to format order in order type
	for rows.Next() {

		var order order

		err = rows.Scan(&order.OrderID, &order.MerchantID, &order.DeliveryID, &order.CustomerID, &order.OrderStatus)

		orders = append(orders, order)
	}

	// return the order array in json format
	json.NewEncoder(w).Encode(orders)

}

// GetOrdersByDelivery get all the orders by Delivery
func GetOrdersByDelivery(w http.ResponseWriter, r *http.Request) {

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
	stmtOut, err := db.Prepare("SELECT * FROM orders WHERE deliveryID = ?")

	// close stmtOut request
	defer stmtOut.Close()

	checkErr(err)

	// filter the orders by deliveryID
	rows, err := stmtOut.Query(user.UserID)

	checkErr(err)

	// create an array of order type to store all the orders
	var orders []order

	// iterate over rows to format order in order type
	for rows.Next() {

		var order order

		err = rows.Scan(&order.OrderID, &order.MerchantID, &order.DeliveryID, &order.CustomerID, &order.OrderStatus)

		orders = append(orders, order)
	}

	// return the order array in json format
	json.NewEncoder(w).Encode(orders)

}

// GetOrdersByCustomer get all the orders by Customer
func GetOrdersByCustomer(w http.ResponseWriter, r *http.Request) {

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
	stmtOut, err := db.Prepare("SELECT * FROM orders WHERE customerID = ?")

	// close stmtOut request
	defer stmtOut.Close()

	checkErr(err)

	// filter the orders by customerID
	rows, err := stmtOut.Query(user.UserID)

	checkErr(err)

	// create an array of order type to store all the orders
	var orders []order

	// iterate over rows to format order in order type
	for rows.Next() {

		var order order

		err = rows.Scan(&order.OrderID, &order.MerchantID, &order.DeliveryID, &order.CustomerID, &order.OrderStatus)

		orders = append(orders, order)
	}

	// return the order array in json format
	json.NewEncoder(w).Encode(orders)

}

// UpdateOrderStatus update order status
func UpdateOrderStatus(w http.ResponseWriter, r *http.Request) {

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
	stmt, err := db.Prepare("UPDATE orders SET orderStatus = ? WHERE orderID = ?")

	// close the stmt request
	defer stmt.Close()

	checkErr(err)

	// update the order status of an order
	res, err := stmt.Exec(vars["orderStatus"], vars["orderID"])

	checkErr(err)

	fmt.Println(res.RowsAffected())

	json.NewEncoder(w).Encode("Order status updated!")

}

// OrderPicked update the order with deliveryID
func OrderPicked(w http.ResponseWriter, r *http.Request) {

	// get the bearer token
	bearerHeader := r.Header.Get("Authorization")

	// validate token, it will return a User{UserID, Name}
	user, err := ValidateToken(bearerHeader)

	checkErr(err)

	// get all the params from the request
	vars := mux.Vars(r)

	// create the db connection
	db := getDBConn()

	// close db connection
	defer db.Close()

	// prepare query
	stmt, err := db.Prepare("UPDATE orders SET deliveryID = ?, orderStatus = ? WHERE orderID = ?")

	checkErr(err)

	// execute prepared query. Update the order status to order_picked and deliveryID to UserID by orderID
	res, err := stmt.Exec(user.UserID, "order_picked", vars["orderID"])

	// close stmt request
	defer stmt.Close()

	checkErr(err)

	fmt.Println(res.RowsAffected())

	// send response in json format
	json.NewEncoder(w).Encode("Order status updated!")

}

// DeleteOrder delete order by orderID
func DeleteOrder(w http.ResponseWriter, r *http.Request) {

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
	stmt, err := db.Prepare("DELETE FROM orders WHERE orderID = ?")

	// close the stmt request
	defer stmt.Close()

	checkErr(err)

	// execute the prepared query. Delete the order from the orders table by order id
	res, err := stmt.Exec(vars["orderID"])

	checkErr(err)

	fmt.Println(res.RowsAffected())

	json.NewEncoder(w).Encode("Order Deleted")

}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}
