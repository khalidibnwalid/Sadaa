package mocks

import (
	"github.com/khalidibnwalid/sadaa/server/internal/app"
)


func DefaultAuthConfig() *app.AuthConfig {
	return &app.AuthConfig{
		JWTSecret:     "test_secret",
	}
}