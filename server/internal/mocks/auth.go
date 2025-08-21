package mocks

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"github.com/khalidibnwalid/sadaa/server/internal/services/auth"
)

// InjectAuthContext returns a context with the user ID set for authentication mocking.
func InjectAuthContext(t *testing.T, ctx context.Context, userID uuid.UUID) context.Context {
	t.Helper()
	return context.WithValue(ctx, auth.AuthCtxKey, userID.String())
}
