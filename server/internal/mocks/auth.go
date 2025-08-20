package mocks

import (
	"context"

	"github.com/google/uuid"
	"github.com/khalidibnwalid/sadaa/server/internal/services/auth"
)

// InjectAuthContext returns a context with the user ID set for authentication mocking.
func InjectAuthContext(ctx context.Context, userID uuid.UUID) context.Context {
	return context.WithValue(ctx, auth.AuthCtxKey, userID.String())
}
