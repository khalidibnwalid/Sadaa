package mocks

import (
	"context"
	"testing"

	"github.com/khalidibnwalid/sadaa/server/internal/crypto"
	"github.com/khalidibnwalid/sadaa/server/internal/db"
	"github.com/khalidibnwalid/sadaa/server/internal/models"
	"github.com/khalidibnwalid/sadaa/server/internal/services/auth"
)

type MockUser struct {
	*models.User
	Password string
}

func NewUser(t *testing.T, q *db.Queries) *MockUser {
	t.Helper()
	// Create a new user instance with default values
	username := crypto.RandomString(20)
	email := username + "@example.com"
	password := crypto.RandomString(10)

	usr := models.NewUser().WithPassword(password)

	dbUsr, _ := q.CreateUser(context.Background(), db.CreateUserParams{
		Email:          email,
		Username:       username,
		HashedPassword: usr.HashedPassword,
	})

	return &MockUser{
		User:     models.NewUser(&dbUsr),
		Password: password,
	}
}

func (u *MockUser) InjectAuthContext(t *testing.T, ctx context.Context) context.Context {
	t.Helper()
	return context.WithValue(ctx, auth.AuthCtxKey, u.User.ID.String())
}