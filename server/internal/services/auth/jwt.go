package auth

import (
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const AuthCookieName = "auth-cookie"
const jwtTTL = 10 * 24 * time.Hour

// creates a new JWT token for a user
func generateJwtToken(secret, userId string) (jwtToken string, err error) {
	headerAndPayload := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": userId,
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(jwtTTL).Unix(),
	})

	jwtToken, err = headerAndPayload.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}
	return jwtToken, nil
}

// validates the JWT token and returns the claims if valid
func validateJwtToken(secret, tokenString string) (token *jwt.Token, claims jwt.MapClaims) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(secret), nil
	})

	if err != nil || !token.Valid {
		return nil, nil
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, nil
	}

	return token, claims
}

// serializes the JWT token into an http.Cookie
func createJWTCookie(token string, secure bool) *http.Cookie {
	formattedExpire := time.Now().Add(jwtTTL)

	return &http.Cookie{
		Name:     AuthCookieName,
		Value:    token,
		Path:     "/",
		Expires:  formattedExpire,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Secure:   secure,
	}
}

func tokenExpired(exp float64) bool {
	expInt := int64(exp)
	return time.Now().Unix() > expInt
}
