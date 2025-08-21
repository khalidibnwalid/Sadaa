package resolvers_test

import (
	"context"
	"fmt"
	"net/http/httptest"
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/google/uuid"
	"github.com/khalidibnwalid/sadaa/server/internal/crypto"
	"github.com/khalidibnwalid/sadaa/server/internal/middleware"
	"github.com/khalidibnwalid/sadaa/server/internal/mocks"
	"github.com/khalidibnwalid/sadaa/server/internal/resolvers"
	"github.com/khalidibnwalid/sadaa/server/internal/services/auth"
	"github.com/stretchr/testify/assert"
)

func TestUserLogin(t *testing.T) {
	db := mocks.GetDbQueries(t)
	gql := mocks.NewGqlClient(t)

	t.Run("should login with valid username", func(t *testing.T) {
		user := mocks.NewUser(t, db)

		var resp struct {
			Login struct {
				ID       string
				Email    string
				Username string
			}
		}

		query := `
				mutation Login($input: loginInput!) {
					login(input: $input) {
						id
						email
						username
					}
				}
				`

		// to capture header writing and mocking it in a ctx
		rw := httptest.NewRecorder()
		ctx := context.WithValue(t.Context(), middleware.ResponseWriterCtxKey, rw)

		err := gql.Client.Post(query, &resp, client.Var("input", map[string]string{
			"credential": user.Email,
			"password":   user.Password,
		}), gql.WithContext(ctx))

		assert.Contains(t, rw.Header().Values("Set-Cookie")[0], fmt.Sprintf("%s=", auth.AuthCookieName))
		assert.NoError(t, err)
		assert.ObjectsAreEqual(resp.Login, user.User)
	})

	t.Run("should login with valid email", func(t *testing.T) {
		user := mocks.NewUser(t, db)

		var resp struct {
			Login struct {
				ID       string
				Email    string
				Username string
			}
		}

		query := `
			mutation Login($input: loginInput!) {
				login(input: $input) {
					id
					email
					username
				}
			}
		`

		// to capture header writing and mocking it in a ctx
		rw := httptest.NewRecorder()
		ctx := context.WithValue(t.Context(), middleware.ResponseWriterCtxKey, rw)

		err := gql.Client.Post(query, &resp, client.Var("input", map[string]string{
			"credential": user.Email,
			"password":   user.Password,
		}), gql.WithContext(ctx))

		assert.Contains(t, rw.Header().Values("Set-Cookie")[0], fmt.Sprintf("%s=", auth.AuthCookieName))
		assert.NoError(t, err)
		assert.ObjectsAreEqual(resp.Login, user.User)
	})

	// the only negative test that checks for cookie presence
	t.Run("should not login with invalid password", func(t *testing.T) {
		user := mocks.NewUser(t, db)

		var resp struct {
			Login struct {
				ID       string
				Email    string
				Username string
			}
		}

		query := `
			mutation Login($input: loginInput!) {
				login(input: $input) {
					id
					email
					username
				}
			}
		`

		// to capture header writing and mocking it in a ctx
		rw := httptest.NewRecorder()
		ctx := context.WithValue(t.Context(), middleware.ResponseWriterCtxKey, rw)

		err := gql.Client.Post(query, &resp, client.Var("input", map[string]string{
			"credential": user.Username,
			"password":   "wrongpassword",
		}), gql.WithContext(ctx))

		assert.Empty(t, rw.Header().Values("Set-Cookie"))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrInvalidPassword.Error())
	})

	t.Run("should not login with unexisting username", func(t *testing.T) {
		var resp struct {
			Login struct {
				ID       string
				Email    string
				Username string
			}
		}

		query := `
			mutation Login($input: loginInput!) {
				login(input: $input) {
					id
					email
					username
				}
			}
		`

		err := gql.Client.Post(query, &resp, client.Var("input", map[string]string{
			"credential": "nonexistentuser",
			"password":   "somepassword",
		}))

		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrUserNotFound.Error())
	})

	t.Run("should not login with unexisting email", func(t *testing.T) {
		var resp struct {
			Login struct {
				ID       string
				Email    string
				Username string
			}
		}

		query := `
			mutation Login($input: loginInput!) {
				login(input: $input) {
					id
					email
					username
				}
			}
		`

		err := gql.Client.Post(query, &resp, client.Var("input", map[string]string{
			"credential": "nonexistent@email.com",
			"password":   "somepassword",
		}))

		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrUserNotFound.Error())
	})
}

func TestUserSignup(t *testing.T) {
	db := mocks.GetDbQueries(t)
	gql := mocks.NewGqlClient(t)

	t.Run("should signup with valid input", func(t *testing.T) {
		user := mocks.NewUser(t, db)
		input := map[string]string{
			"email":    crypto.RandomString(10) + "@example.com",
			"username": crypto.RandomString(10),
			"password": user.Password,
		}

		var resp struct {
			Signup struct {
				ID       string
				Email    string
				Username string
			}
		}

		query := `
			mutation Signup($input: signupInput!) {
				signup(input: $input) {
					id
					email
					username
				}
			}
		`

		// to capture header writing and mocking it in a ctx
		rw := httptest.NewRecorder()
		ctx := context.WithValue(t.Context(), middleware.ResponseWriterCtxKey, rw)

		err := gql.Client.Post(query, &resp, client.Var("input", input), gql.WithContext(ctx))

		assert.NoError(t, err)
		assert.Contains(t, rw.Header().Values("Set-Cookie")[0], fmt.Sprintf("%s=", auth.AuthCookieName))
		assert.Equal(t, input["email"], resp.Signup.Email)
		assert.Equal(t, input["username"], resp.Signup.Username)
	})

	// the only negative test that checks for cookie presence
	t.Run("should not signup with existing email", func(t *testing.T) {
		user := mocks.NewUser(t, db)
		input := map[string]string{
			"email":    user.Email,
			"username": crypto.RandomString(10),
			"password": user.Password,
		}

		var resp struct {
			Signup struct {
				ID       string
				Email    string
				Username string
			}
		}

		query := `
			mutation Signup($input: signupInput!) {
				signup(input: $input) {
					id
					email
					username
				}
			}
		`

		// to capture header writing and mocking it in a ctx
		rw := httptest.NewRecorder()
		ctx := context.WithValue(t.Context(), middleware.ResponseWriterCtxKey, rw)

		err := gql.Client.Post(query, &resp, client.Var("input", input), gql.WithContext(ctx))

		assert.Empty(t, rw.Header().Values("Set-Cookie"))
		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrEmailExists.Error())
	})

	t.Run("should not signup with existing username", func(t *testing.T) {
		user := mocks.NewUser(t, db)
		input := map[string]string{
			"email":    crypto.RandomString(10) + "@example.com",
			"username": user.Username,
			"password": user.Password,
		}

		var resp struct {
			Signup struct {
				ID       string
				Email    string
				Username string
			}
		}

		query := `
			mutation Signup($input: signupInput!) {
				signup(input: $input) {
					id
					email
					username
				}
			}
		`

		err := gql.Client.Post(query, &resp, client.Var("input", input))

		t.Log(resp)
		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrUsernameExists.Error())
	})

	t.Run("should not signup with invalid email", func(t *testing.T) {
		user := mocks.NewUser(t, db)
		input := map[string]string{
			"email":    "invalid-email",
			"username": crypto.RandomString(10),
			"password": user.Password,
		}

		var resp struct {
			Signup struct {
				ID       string
				Email    string
				Username string
			}
		}

		query := `
			mutation Signup($input: signupInput!) {
				signup(input: $input) {
					id
					email
					username
				}
			}
		`

		err := gql.Client.Post(query, &resp, client.Var("input", input))

		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrInvalidEmailAddress.Error())
	})

}

func TestGetUser(t *testing.T) {
	db := mocks.GetDbQueries(t)
	gql := mocks.NewGqlClient(t)

	t.Run("should get user when authorized", func(t *testing.T) {
		user := mocks.NewUser(t, db)

		var resp struct {
			GetUser struct {
				ID        string
				Email     string
				Username  string
				AvatarUrl string
				CreatedAt string
				UpdatedAt string
			}
		}

		query := `
			query GetUser {
				getUser {
					id
					email
					username
					avatarUrl
					createdAt
					updatedAt
				}
			}
		`

		ctx := user.InjectAuthContext(t, t.Context())
		err := gql.Client.Post(query, &resp, gql.WithContext(ctx))

		assert.NoError(t, err)
		assert.Equal(t, user.User.ID.String(), resp.GetUser.ID)
		assert.Equal(t, user.User.Email, resp.GetUser.Email)
		assert.Equal(t, user.User.Username, resp.GetUser.Username)
	})

	t.Run("should fail when unauthorized", func(t *testing.T) {
		var resp struct {
			GetUser struct {
				ID       string
				Email    string
				Username string
			}
		}

		query := `
			query GetUser {
				getUser {
					id
					email
					username
				}
			}
		`

		err := gql.Client.Post(query, &resp)

		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrUnauthorized.Error())
	})

	t.Run("should fail when user not found", func(t *testing.T) {
		// Use a random user ID that does not exist
		fakeID := uuid.Nil

		var resp struct {
			GetUser struct {
				ID       string
				Email    string
				Username string
			}
		}

		query := `
			query GetUser {
				getUser {
					id
					email
					username
				}
			}
		`

		ctx := mocks.InjectAuthContext(t, t.Context(), fakeID)
		err := gql.Client.Post(query, &resp, gql.WithContext(ctx))

		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrUserNotFound.Error())
	})
}
