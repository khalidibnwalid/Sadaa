package auth

import (
	"context"
	"fmt"
	"net/http"

	"github.com/google/uuid"
)

type ctxKey string

const AuthCtxKey ctxKey = "auth.user_id"

func For(ctx context.Context) (id *uuid.UUID, ok bool) {
	if val := ctx.Value(AuthCtxKey); val != nil {
		uuidId, err := uuid.Parse(val.(string))
		if err == nil {
			return &uuidId, true
		}
	}
	return nil, false
}

// just check for authentication
func IsAuthed(ctx context.Context) bool {
	_, ok := For(ctx)
	return ok
}

// extracts the user ID from the JWT stored in the cookie.
func GetAuthFromCookie(secret string, cookieValue string) (*uuid.UUID, error) {
	if cookieValue == "" {
		return nil, fmt.Errorf("empty token string")
	}

	_, claims := validateJwtToken(secret, cookieValue)
	if claims == nil {
		return nil, fmt.Errorf("invalid token claims")
	}

	expVal, ok := claims["exp"]
	if !ok {
		return nil, fmt.Errorf("token missing exp claim")
	}
	expFloat, ok := expVal.(float64)
	if !ok || tokenExpired(expFloat) {
		return nil, fmt.Errorf("token expired or invalid exp claim")
	}

	sub, ok := claims["sub"].(string)
	if !ok || sub == "" {
		return nil, fmt.Errorf("token missing sub claim")
	}

	uuidId, err := uuid.Parse(sub)
	if err != nil {
		return nil, fmt.Errorf("invalid user id in token: %w", err)
	}
	return &uuidId, nil
}

// creates a JWT for the user and serializes it as a cookie string.
func GenerateAuthCookie(userId *uuid.UUID, secret string, secure bool) (*http.Cookie, error) {
	if userId == nil {
		return nil, fmt.Errorf("invalid user ID")
	}
	token, err := generateJwtToken(secret, userId.String())
	if err != nil {
		return nil, fmt.Errorf("failed to generate JWT: %w", err)
	}
	return createJWTCookie(token, secure), nil
}

