package router

import (
	"mysql-go-server/middleware"

	"github.com/gorilla/mux"
)

// Router is exported and used in main.go
func Router() *mux.Router {

	// create a new router
	router := mux.NewRouter()

	// ------------------------------ User signin routes --------------------------------------

	router.HandleFunc("/signInMerchant", middleware.SignInMerchant).Methods("POST")

	router.HandleFunc("/signInDelivery", middleware.SignInDelivery).Methods("POST")

	router.HandleFunc("/signInCustomer", middleware.SignInCustomer).Methods("POST")

	// ------------------------------ Order routes ---------------------------------------------

	router.HandleFunc("/createOrder", middleware.CreateOrder).Methods("POST")

	router.HandleFunc("/getAllOrders", middleware.GetAllOrders).Methods("GET")

	router.HandleFunc("/getOrder/{orderID}", middleware.GetOrder).Methods("GET")

	router.HandleFunc("/getOrdersByStatus/{orderStatus}", middleware.GetOrdersByStatus).Methods("GET")

	router.HandleFunc("/getOrdersByMerchant", middleware.GetOrdersByMerchant).Methods("GET")

	router.HandleFunc("/getOrdersByDelivery", middleware.GetOrdersByDelivery).Methods("GET")

	router.HandleFunc("/getOrdersByCustomer", middleware.GetOrdersByCustomer).Methods("GET")

	router.HandleFunc("/updateOrderStatus/{orderID}/{orderStatus}", middleware.UpdateOrderStatus).Methods("PUT")

	router.HandleFunc("/orderPicked/{orderID}", middleware.OrderPicked).Methods("PUT")

	router.HandleFunc("/deleteOrder/{orderID}", middleware.DeleteOrder).Methods("DELETE")

	// --------------------------------------- return routes --------------------------------------
	return router

}
