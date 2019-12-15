package middleware

import (
	"errors"
	"fmt"
	"strings"

	"github.com/dgrijalva/jwt-go"
)

// User user details
type User struct {
	UserID string `json:"userID"`
	Name   string `json:"name"`
}

// ValidateToken validates the token with the secret key and return the object
func ValidateToken(bearerHeader string) (User, error) {

	// format the token string
	tokenString := strings.Split(bearerHeader, " ")[1]

	var user User

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:

		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte("secretkey"), nil
	})

	if err != nil {

		fmt.Println(err)
		return user, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// convert the interface to the map[string]interface{}
		s := claims["user"].(map[string]interface{})

		// create a user of User type
		// convert the s["userID"] interface to string
		user := User{s["userID"].(string), s["name"].(string)}

		return user, nil

	}

	return user, errors.New("Something went wrong")

}
