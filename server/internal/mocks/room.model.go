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

// creates and inserts a new Room for testing
func NewRoom(t *testing.T, queries *db.Queries, groupID, serverID uuid.UUID) *models.Room {
	room, err := queries.CreateRoom(context.Background(), db.CreateRoomParams{
		ServerID:   serverID,
		GroupID:    groupID,
		Name:       crypto.RandomString(10),
		OrderIndex: ptrInt32(rand.Int32N(100)),
		Type:       "text",
	})
	if err != nil {
		t.Fatalf("failed to create room: %v", err)
	}
	return models.NewRoom(room)
}

// :D
func ptrInt32(i int32) *int32 {
	return &i
}

// creates multiple Rooms for a group
func NewRooms(t *testing.T, queries *db.Queries, groupID, serverID uuid.UUID, count int) []*models.Room {
	rooms := make([]*models.Room, count)
	for i := range rooms {
		rooms[i] = NewRoom(t, queries, groupID, serverID)
	}
	return rooms
}
