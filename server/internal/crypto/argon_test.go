package crypto_test

import (
	"fmt"
	"testing"

	"github.com/khalidibnwalid/sadaa/server/internal/crypto"

	"github.com/stretchr/testify/assert"
)

func TestArgonSerializeDeserializeHash(t *testing.T) {
	hasher := crypto.NewArgon2idHasher()

	t.Run("should serialize and deserialize a hash with salt", func(t *testing.T) {
		valueToHash := crypto.RandomString(10)
		// original hash
		hash, salt := hasher.HashWithSalt(valueToHash)
		serialized := hasher.SerializeHashWithSalt(hash, salt)

		// Test deserialization
		deserializedHash, deserializedSalt, err := hasher.DeserializeHashWithSalt(serialized)
		assert.Nil(t, err, fmt.Sprintf("Failed to deserialize hash: %v", err))

		assert.Equal(t, hash, deserializedHash, "Original and deserialized hash are not equal")
		assert.Equal(t, salt, deserializedSalt, "Original and deserialized salt are not equal")

	})

	t.Run("should return error if invalid serialized format was provided", func(t *testing.T) {
		_, _, err := hasher.DeserializeHashWithSalt("invalid$format")
		assert.Equal(t, err, crypto.ErrInvalidHashFormat, fmt.Sprintf("Expected ErrInvalidHashFormat, got %v", err))
	})
}

func TestArgonVerifyHashWithSalt(t *testing.T) {
	hasher := crypto.NewArgon2idHasher()
	securePassword := crypto.RandomString(10)

	hash, salt := hasher.HashWithSalt(securePassword)
	serialized := hasher.SerializeHashWithSalt(hash, salt)

	t.Run("should verify a hash with salt", func(t *testing.T) {
		err := hasher.VerifyHashWithSalt(securePassword, serialized)
		assert.Nil(t, err, fmt.Sprintf("Failed to verify hash: %v", err))
	})

	t.Run("should return error if hash verification failed", func(t *testing.T) {
		wrongPassword := "wrongPassword"
		err := hasher.VerifyHashWithSalt(wrongPassword, serialized)
		if err != crypto.ErrHashVerificationFailed {
			t.Errorf("Expected ErrHashVerificationFailed, got %v", err)
		}
	})

	t.Run("should return error if invalid serialized format was provided", func(t *testing.T) {
		err := hasher.VerifyHashWithSalt(securePassword, "invalid$format")
		if err != crypto.ErrInvalidHashFormat {
			t.Errorf("Expected ErrInvalidHashFormat, got %v", err)
		}
	})
}
