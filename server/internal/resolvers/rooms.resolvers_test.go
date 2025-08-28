package resolvers_test

import (
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/khalidibnwalid/sadaa/server/internal/mocks"
	"github.com/khalidibnwalid/sadaa/server/internal/resolvers"
	"github.com/stretchr/testify/assert"
)

func TestCreateRoom(t *testing.T) {
	db := mocks.GetDbQueries(t)
	gql := mocks.NewGqlClient(t)
	user := mocks.NewUser(t, db)
	server := mocks.NewServer(t, db, user.User.ID)
	group := mocks.NewRoomsGroup(t, db, server.ID)

	t.Run("should create room with valid input and auth", func(t *testing.T) {
		input := map[string]any{
			"groupId":    group.ID.String(),
			"serverId":   server.ID.String(),
			"orderIndex": 0,
			"type":       "text",
			"name":       "Test Room",
		}

		var resp struct {
			CreateRoom struct {
				OrderIndex int32
				GroupID    string
				ServerID   string
				Type       string
				Name       string
			}
		}

		query := `
			mutation CreateRoom($input: CreateRoomInput!) {
				createRoom(input: $input) {
					orderIndex
					groupId
					serverId
					type
					name
				}
			}
		`

		ctx := user.InjectAuthContext(t, t.Context())
		err := gql.Client.Post(query, &resp, client.Var("input", input), gql.WithContext(ctx))
		
		assert.NoError(t, err)
		assert.Equal(t, input["groupId"], resp.CreateRoom.GroupID)
		assert.Equal(t, input["serverId"], resp.CreateRoom.ServerID)
		assert.Equal(t, input["type"], resp.CreateRoom.Type)
		assert.Equal(t, input["name"], resp.CreateRoom.Name)
		
		assert.EqualValues(t, input["orderIndex"], resp.CreateRoom.OrderIndex)
	})

	t.Run("should fail to create room when unauthorized", func(t *testing.T) {
		input := map[string]any{
			"name":       "Test Room",
			"groupId":    group.ID.String(),
			"serverId":   server.ID.String(),
			"type":       "text",
			"orderIndex": 0,
		}

		var resp struct {
			CreateRoom struct {
				ID string
			}
		}

		query := `
			mutation CreateRoom($input: CreateRoomInput!) {
				createRoom(input: $input) {
					id
				}
			}
		`

		err := gql.Client.Post(query, &resp, client.Var("input", input))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrUnauthorized.Error())
	})
}

func TestRoomQuery(t *testing.T) {
	db := mocks.GetDbQueries(t)
	gql := mocks.NewGqlClient(t)
	user := mocks.NewUser(t, db)
	server := mocks.NewServer(t, db, user.User.ID)
	group := mocks.NewRoomsGroup(t, db, server.ID)
	room := mocks.NewRoom(t, db, group.ID, server.ID)

	t.Run("should get room when authed", func(t *testing.T) {
		var resp struct {
			Room struct {
				ID   string
				Name string
			}
		}
		query := `
			query Room($id: UUID!) {
				room(id: $id) {
					id
					name
				}
			}
		`
		ctx := user.InjectAuthContext(t, t.Context())
		err := gql.Client.Post(query, &resp, client.Var("id", room.ID.String()), gql.WithContext(ctx))
		assert.NoError(t, err)
		assert.Equal(t, room.ID.String(), resp.Room.ID)
		assert.Equal(t, room.Name, resp.Room.Name)
	})

	t.Run("should fail when unauthorized", func(t *testing.T) {
		var resp struct {
			Room struct {
				ID string
			}
		}
		query := `
			query Room($id: UUID!) {
				room(id: $id) {
					id
				}
			}
		`
		err := gql.Client.Post(query, &resp, client.Var("id", room.ID.String()))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrUnauthorized.Error())
	})
}
