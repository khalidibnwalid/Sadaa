package mocks

import (
	"testing"

	"github.com/google/uuid"
	"github.com/khalidibnwalid/sadaa/server/internal/db"
	"github.com/khalidibnwalid/sadaa/server/internal/models"
)

type MockServerMemberModel struct {
	*models.ServerMember
}

func NewServerMember(t *testing.T, q *db.Queries, userId uuid.UUID, serverId uuid.UUID) *MockServerMemberModel {
	t.Helper()
	server, _ := q.CreateServerMember(t.Context(), db.CreateServerMemberParams{
		ServerID: serverId,
		UserID:   userId,
	})

	return &MockServerMemberModel{
		ServerMember: &models.ServerMember{
			ServerMember: server,
		},
	}

}
