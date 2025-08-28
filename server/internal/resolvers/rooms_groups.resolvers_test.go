package resolvers_test

import (
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/khalidibnwalid/sadaa/server/internal/mocks"
	"github.com/khalidibnwalid/sadaa/server/internal/resolvers"
	"github.com/stretchr/testify/assert"
)

func TestCreateRoomsGroup(t *testing.T) {
	db := mocks.GetDbQueries(t)
	gql := mocks.NewGqlClient(t)
	user := mocks.NewUser(t, db)
	server := mocks.NewServer(t, db, user.User.ID)

	t.Run("should create rooms group with valid input and auth", func(t *testing.T) {
		input := map[string]any{
			"serverId":   server.ID.String(),
			"name":       "Test Group",
			"orderIndex": 0,
		}

		var resp struct {
			CreateRoomsGroup struct {
				ID         string
				Name       string
				OrderIndex int32
				ServerID   string
			}
		}

		query := `
			mutation CreateRoomsGroup($input: CreateRoomsGroupInput!) {
				createRoomsGroup(input: $input) {
					id
					name
					orderIndex
					serverId
				}
			}
		`

		ctx := user.InjectAuthContext(t, t.Context())
		err := gql.Client.Post(query, &resp, client.Var("input", input), gql.WithContext(ctx))

		assert.NoError(t, err)
		assert.Equal(t, input["name"], resp.CreateRoomsGroup.Name)
		assert.Equal(t, input["serverId"], resp.CreateRoomsGroup.ServerID)
		assert.EqualValues(t, input["orderIndex"], resp.CreateRoomsGroup.OrderIndex)
		assert.NotEmpty(t, resp.CreateRoomsGroup.ID)
	})

	t.Run("should fail to create rooms group when unauthorized", func(t *testing.T) {
		input := map[string]any{
			"serverId":   server.ID.String(),
			"name":       "Test Group",
			"orderIndex": 0,
		}

		var resp struct {
			CreateRoomsGroup struct {
				ID string
			}
		}

		query := `
			mutation CreateRoomsGroup($input: CreateRoomsGroupInput!) {
				createRoomsGroup(input: $input) {
					id
				}
			}
		`

		err := gql.Client.Post(query, &resp, client.Var("input", input))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrUnauthorized.Error())
	})
}

func TestRoomsGroupsQuery(t *testing.T) {
	db := mocks.GetDbQueries(t)
	gql := mocks.NewGqlClient(t)
	user := mocks.NewUser(t, db)
	server := mocks.NewServer(t, db, user.User.ID)
	mocks.NewRoomsGroups(t, db, server.ID, 3)

	t.Run("should get rooms groups when authed", func(t *testing.T) {
		var resp struct {
			RoomsGroups []struct {
				ID   string
				Name string
			}
		}
		query := `
			query RoomsGroups($serverId: UUID!) {
				roomsGroups(serverId: $serverId) {
					id
					name
				}
			}
		`
		ctx := user.InjectAuthContext(t, t.Context())
		err := gql.Client.Post(query, &resp, client.Var("serverId", server.ID.String()), gql.WithContext(ctx))

		assert.NoError(t, err)
		assert.Len(t, resp.RoomsGroups, 3)
	})

	t.Run("should fail when unauthorized", func(t *testing.T) {
		var resp struct {
			RoomsGroups []struct {
				ID string
			}
		}
		query := `
			query RoomsGroups($serverId: UUID!) {
				roomsGroups(serverId: $serverId) {
					id
				}
			}
		`
		err := gql.Client.Post(query, &resp, client.Var("serverId", server.ID.String()))

		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrUnauthorized.Error())
	})
}
