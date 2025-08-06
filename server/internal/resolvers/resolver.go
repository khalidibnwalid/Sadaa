package resolvers

//go:generate go run github.com/99designs/gqlgen
//go:generate go run github.com/99designs/gqlgen generate

import "github.com/khalidibnwalid/sadaa/server/internal/db"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	DB *db.Queries
}
