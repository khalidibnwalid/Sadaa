package mocks

import (
	"testing"

	"github.com/khalidibnwalid/sadaa/server/internal/app"
)


func DefaultAuthConfig(t *testing.T) *app.AuthConfig {
	t.Helper()
	return &app.AuthConfig{
		JWTSecret:     "test_secret",
	}
}