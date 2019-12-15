package main

import (
	"fmt"
	"log"
	"mysql-go-server/router"
	"net/http"

	"github.com/gorilla/handlers"
)

func main() {

	r := router.Router()

	fmt.Println("Starting server on the port 8000...")
	log.Fatal(http.ListenAndServe(":8000", handlers.CORS(handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}), handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}), handlers.AllowedOrigins([]string{"*"}))(r)))

}
