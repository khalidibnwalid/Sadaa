package mocks

import (
	"context"

	"github.com/khalidibnwalid/sadaa/server/internal/crypto"
	"github.com/khalidibnwalid/sadaa/server/internal/db"
	"github.com/khalidibnwalid/sadaa/server/internal/models"
)

type MockUser struct {
	*models.User
	Password string
}

func NewUser(q *db.Queries) *MockUser {
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
