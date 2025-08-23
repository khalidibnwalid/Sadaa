package resolvers_test

import (
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/google/uuid"
	"github.com/khalidibnwalid/sadaa/server/internal/mocks"
	"github.com/khalidibnwalid/sadaa/server/internal/resolvers"
	"github.com/stretchr/testify/assert"
)

func TestServerMemberships(t *testing.T) {
	db := mocks.GetDbQueries(t)
	gql := mocks.NewGqlClient(t)

	t.Run("should get server memberships when authed", func(t *testing.T) {
		user := mocks.NewUser(t, db)
		server := mocks.NewServer(t, db, user.User.ID)
		mocks.NewServerMember(t, db, user.User.ID, server.ID)

		var resp struct {
			ServerMemberships []struct {
				UserID   string
				ServerID string
				Server   struct {
					ID   string
					Name string
				}
			}
		}

		query := `
			query {
				serverMemberships {
					userId
					serverId
					server { id name }
				}
			}
		`

		ctx := user.InjectAuthContext(t, t.Context())
		err := gql.Client.Post(query, &resp, gql.WithContext(ctx))
		assert.NoError(t, err)
		assert.NotEmpty(t, resp.ServerMemberships)
		assert.Equal(t, user.User.ID.String(), resp.ServerMemberships[0].UserID)
		assert.Equal(t, server.ID.String(), resp.ServerMemberships[0].ServerID)
	})

	t.Run("should fail when unauthorized", func(t *testing.T) {
		var resp struct {
			ServerMemberships []struct{ UserID string }
		}
		query := `query { serverMemberships { userId } }`
		err := gql.Client.Post(query, &resp)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrUnauthorized.Error())
	})
}

func TestServerMembership(t *testing.T) {
	db := mocks.GetDbQueries(t)
	gql := mocks.NewGqlClient(t)

	t.Run("should get server membership when authed", func(t *testing.T) {
		user := mocks.NewUser(t, db)
		server := mocks.NewServer(t, db, user.User.ID)
		mocks.NewServerMember(t, db, user.User.ID, server.ID)

		var resp struct {
			ServerMembership struct {
				UserID   string
				ServerID string
				Server   struct {
					ID   string
					Name string
				}
			}
		}

		query := `
			query ServerMembership($serverId: UUID!) {
				serverMembership(serverId: $serverId) {
					userId
					serverId
					server { id name }
				}
			}
		`

		ctx := user.InjectAuthContext(t, t.Context())
		err := gql.Client.Post(query, &resp, client.Var("serverId", server.ID.String()), gql.WithContext(ctx))
		assert.NoError(t, err)
		assert.Equal(t, user.User.ID.String(), resp.ServerMembership.UserID)
		assert.Equal(t, server.ID.String(), resp.ServerMembership.ServerID)
	})

	t.Run("should fail when unauthorized", func(t *testing.T) {
		server := mocks.NewServer(t, db, uuid.New())
		var resp struct {
			ServerMembership struct{ UserID string }
		}
		query := `query ServerMembership($serverId: UUID!) { serverMembership(serverId: $serverId) { userId } }`
		err := gql.Client.Post(query, &resp, client.Var("serverId", server.ID.String()))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrUnauthorized.Error())
	})

	t.Run("should fail when not a member", func(t *testing.T) {
		user := mocks.NewUser(t, db)
		server := mocks.NewServer(t, db, uuid.New())
		var resp struct {
			ServerMembership struct{ UserID string }
		}
		query := `query ServerMembership($serverId: UUID!) { serverMembership(serverId: $serverId) { userId } }`
		ctx := user.InjectAuthContext(t, t.Context())
		err := gql.Client.Post(query, &resp, client.Var("serverId", server.ID.String()), gql.WithContext(ctx))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrNotFound.Error())
	})
}
