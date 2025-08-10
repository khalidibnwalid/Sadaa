package models_test

import (
	"testing"

	"github.com/khalidibnwalid/sadaa/server/internal/models"
	"github.com/stretchr/testify/assert"
)

func TestUser_WithPassword(t *testing.T) {
	t.Run("sets HashedPassword", func(t *testing.T) {
		plainPassword := "mySecret123"
		user := models.NewUser().WithPassword(plainPassword)

		assert.NotEmpty(t, user.HashedPassword, "Expected HashedPassword to be set")
		assert.NotEqual(t, plainPassword, user.HashedPassword, "Expected HashedPassword to be different from plain password")
	})

	t.Run("overwrites previous hash", func(t *testing.T) {
		user := models.NewUser().WithPassword("firstPassword")
		firstHash := user.HashedPassword

		user.WithPassword("secondPassword")
		secondHash := user.HashedPassword

		assert.NotEqual(t, firstHash, secondHash, "Expected different hashes for different passwords")
	})
}

func TestUser_VerifyPassword(t *testing.T) {
	t.Run("with correct password", func(t *testing.T) {
		plainPassword := "testPassword!"
		user := models.NewUser().WithPassword(plainPassword)

		err := user.VerifyPassword(plainPassword)
		assert.NoError(t, err, "Expected password verification to succeed")
	})

	t.Run("with wrong password", func(t *testing.T) {
		plainPassword := "rightPassword"
		wrongPassword := "wrongPassword"
		user := models.NewUser().WithPassword(plainPassword)

		err := user.VerifyPassword(wrongPassword)
		assert.Error(t, err, "Expected password verification to fail for wrong password")
	})
}
func TestUser_WithEmail(t *testing.T) {
	t.Run("valid email", func(t *testing.T) {
		user := models.NewUser()
		email := "test@example.com"

		err := user.WithEmail(email)
		assert.NoError(t, err, "Expected no error for valid email")
		assert.Equal(t, email, user.Email, "Expected email to be set correctly")
	})

	t.Run("invalid email", func(t *testing.T) {
		user := models.NewUser()
		invalidEmail := "invalid-email"

		err := user.WithEmail(invalidEmail)
		assert.Error(t, err, "Expected error for invalid email")
		assert.Empty(t, user.Email, "Expected email to be empty")
	})

	t.Run("empty email", func(t *testing.T) {
		user := models.NewUser()
		emptyEmail := ""

		err := user.WithEmail(emptyEmail)
		assert.Error(t, err, "Expected error for empty email")
		assert.Empty(t, user.Email, "Expected email to be empty")
	})
}
