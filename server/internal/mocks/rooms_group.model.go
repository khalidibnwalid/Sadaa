package mocks

import (
	"context"
	"math/rand/v2"
	"testing"

	"github.com/google/uuid"
	"github.com/khalidibnwalid/sadaa/server/internal/crypto"
	"github.com/khalidibnwalid/sadaa/server/internal/models"
	"github.com/khalidibnwalid/sadaa/server/internal/platforms/db"
)

// creates and inserts a new RoomsGroup for testing
func NewRoomsGroup(t *testing.T, queries *db.Queries, serverID uuid.UUID) *models.RoomsGroup {
	rg, err := queries.CreateRoomsGroup(context.Background(), db.CreateRoomsGroupParams{
		ServerID:   serverID,
		Name:       crypto.RandomString(10),
		OrderIndex: rand.Int32N(100),
	})
	if err != nil {
		t.Fatalf("failed to create rooms group: %v", err)
	}
	return models.NewRoomsGroup(rg, []*db.Room{})
}

// creates multiple RoomsGroups for a server
func NewRoomsGroups(t *testing.T, queries *db.Queries, serverID uuid.UUID, count int) []*models.RoomsGroup {
	groups := make([]*models.RoomsGroup, count)
	for i := range count {
		groups[i] = NewRoomsGroup(t, queries, serverID)
	}
	return groups
}
