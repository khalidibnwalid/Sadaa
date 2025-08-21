package resolvers_test

import (
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/google/uuid"
	"github.com/khalidibnwalid/sadaa/server/internal/mocks"
	"github.com/khalidibnwalid/sadaa/server/internal/resolvers"
	"github.com/stretchr/testify/assert"
)

func TestCreateServer(t *testing.T) {
	db := mocks.GetDbQueries(t)
	gql := mocks.NewGqlClient(t)

	t.Run("should create server with valid input and auth", func(t *testing.T) {
		user := mocks.NewUser(t, db)
		input := map[string]any{
			"name":     "Test Server",
			"coverUrl": "http://example.com/cover.png",
		}

		var resp struct {
			CreateServer struct {
				UserId   string
				ServerId string
				Server   struct {
					ID       string
					Name     string
					CoverUrl string
				}
			}
		}

		query := `
			mutation CreateServer($input: createServerInput!) {
				createServer(input: $input) {
					userId
					serverId
					server {
						id
						name
						coverUrl
					}
				}
			}
		`

		ctx := user.InjectAuthContext(t, t.Context())
		err := gql.Client.Post(query, &resp, client.Var("input", input), gql.WithContext(ctx))

		assert.NoError(t, err)

		assert.Equal(t, input["name"], resp.CreateServer.Server.Name)
		assert.NotNil(t, resp.CreateServer.Server.ID)
		assert.Equal(t, input["coverUrl"], resp.CreateServer.Server.CoverUrl)

		// TODO check owner permissions
		assert.Equal(t, user.User.ID.String(), resp.CreateServer.UserId)
		assert.Equal(t, resp.CreateServer.ServerId, resp.CreateServer.ServerId)
	})

	t.Run("should fail to create server when unauthorized", func(t *testing.T) {
		input := map[string]any{
			"name":     "Test Server",
			"coverUrl": "http://example.com/cover.png",
		}

		var resp struct {
			CreateServer struct {
				UserId string
			}
		}

		query := `
			mutation CreateServer($input: createServerInput!) {
				createServer(input: $input) {
					userId
				}
			}
		`

		err := gql.Client.Post(query, &resp, client.Var("input", input))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrUnauthorized.Error())
	})
}

func TestGetServerInfo(t *testing.T) {
	db := mocks.GetDbQueries(t)
	gql := mocks.NewGqlClient(t)

	t.Run("should get server info when authed", func(t *testing.T) {
		user := mocks.NewUser(t, db)
		server := mocks.NewServer(t, db, user.User.ID)

		var resp struct {
			GetServerInfo struct {
				ID   string
				Name string
			}
		}

		query := `
			query GetServerInfo($id: UUID!) {
				getServerInfo(id: $id) {
					id
					name
				}
			}
		`

		ctx := user.InjectAuthContext(t, t.Context())
		err := gql.Client.Post(query, &resp, client.Var("id", server.ID.String()), gql.WithContext(ctx))

		assert.NoError(t, err)
		assert.Equal(t, server.ID.String(), resp.GetServerInfo.ID)
		assert.Equal(t, server.Name, resp.GetServerInfo.Name)
	})

	t.Run("should fail when unauthorized", func(t *testing.T) {
		server := mocks.NewServer(t, db, uuid.New())

		var resp struct {
			GetServerInfo struct {
				ID string
			}
		}

		query := `
			query GetServerInfo($id: UUID!) {
				getServerInfo(id: $id) {
					id
				}
			}
		`

		err := gql.Client.Post(query, &resp, client.Var("id", server.ID.String()))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrUnauthorized.Error())
	})

	t.Run("should fail when server not found", func(t *testing.T) {
		user := mocks.NewUser(t, db)
		fakeID := uuid.New()

		var resp struct {
			GetServerInfo struct {
				ID string
			}
		}

		query := `
			query GetServerInfo($id: UUID!) {
				getServerInfo(id: $id) {
					id
				}
			}
		`

		ctx := user.InjectAuthContext(t, t.Context())
		err := gql.Client.Post(query, &resp, client.Var("id", fakeID.String()), gql.WithContext(ctx))
		assert.Error(t, err)
		// TODO: update error check if NotFound is implemented
		assert.Contains(t, err.Error(), resolvers.ErrInternalServerError.Error())
	})

}
