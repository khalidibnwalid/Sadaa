package mocks

import (
	"testing"

	"github.com/google/uuid"
	"github.com/khalidibnwalid/sadaa/server/internal/crypto"
	"github.com/khalidibnwalid/sadaa/server/internal/models"
	"github.com/khalidibnwalid/sadaa/server/internal/platforms/db"
)

type MockServerModel struct {
	*models.Server
}

func NewServer(t *testing.T, q *db.Queries, userId uuid.UUID) *MockServerModel {
	t.Helper()
	// Create a new server instance with default values
	name := crypto.RandomString(20)

	server, _ := q.CreateServer(t.Context(), db.CreateServerParams{
		Name:      name,
		CreatorID: userId,
		CoverUrl:  nil,
	})

	return &MockServerModel{
		Server: models.NewServer(server),
	}
}
