package resolvers_test

import (
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/khalidibnwalid/sadaa/server/internal/crypto"
	"github.com/khalidibnwalid/sadaa/server/internal/mocks"
	"github.com/khalidibnwalid/sadaa/server/internal/resolvers"
	"github.com/stretchr/testify/assert"
)

func TestUserLogin(t *testing.T) {
	db := mocks.GetDbQueries(t)
	gql := mocks.NewGqlClient(t)

	t.Run("should login with valid username", func(t *testing.T) {
		user := mocks.NewUser(db)

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
			"credential": user.Email,
			"password":   user.Password,
		}))

		t.Log(resp)
		assert.NoError(t, err)
		assert.ObjectsAreEqual(resp.Login, user.User)
	})

	t.Run("should login with valid email", func(t *testing.T) {
		user := mocks.NewUser(db)

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
			"credential": user.Email,
			"password":   user.Password,
		}))

		t.Log(resp)
		assert.NoError(t, err)
		assert.ObjectsAreEqual(resp.Login, user.User)
	})

	t.Run("should not login with invalid password", func(t *testing.T) {
		user := mocks.NewUser(db)

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
			"credential": user.Username,
			"password":   "wrongpassword",
		}))

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
		user := mocks.NewUser(db)
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

		err := gql.Client.Post(query, &resp, client.Var("input", input))

		t.Log(resp)
		assert.NoError(t, err)
		assert.Equal(t, input["email"], resp.Signup.Email)
		assert.Equal(t, input["username"], resp.Signup.Username)
	})

	t.Run("should not signup with existing email", func(t *testing.T) {
		user := mocks.NewUser(db)
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

		err := gql.Client.Post(query, &resp, client.Var("input", input))

		assert.Error(t, err)
		assert.Contains(t, err.Error(), resolvers.ErrEmailExists.Error())
	})

	t.Run("should not signup with existing username", func(t *testing.T) {
		user := mocks.NewUser(db)
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
		user := mocks.NewUser(db)
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
