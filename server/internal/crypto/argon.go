package crypto

import (
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"

	"golang.org/x/crypto/argon2"
)

type Argon2Hasher struct {
	iterations  uint32
	memory      uint32
	parallelism uint8
	keyLength   uint32
	saltLength  uint32
}

// NewArgon2idHasher creates a new Argon2idHasher with default options
func NewArgon2idHasher() *Argon2Hasher {
	return &Argon2Hasher{
		memory:      4 * 1024,
		iterations:  3,
		parallelism: 1,
		keyLength:   32,
		saltLength:  16,
	}
}

// HashWithSalt implements the Hasher interface for Argon2id
// providedSalt: optional salt to use, if not provided a random salt will be generated
func (a *Argon2Hasher) HashWithSalt(value string, providedSalt ...[]byte) (hash []byte, salt []byte) {
	if len(providedSalt) > 0 {
		salt = providedSalt[0]
	} else {
		salt = RandomBytes(a.saltLength)
	}

	hash = argon2.IDKey([]byte(value), salt, a.iterations, a.memory, a.parallelism, a.keyLength)
	return hash, salt
}

// SerializeHashWithSalt implements the Hasher interface for Argon2id
// Serialize the hash and salt into Argon2id hash string
func (a *Argon2Hasher) SerializeHashWithSalt(hash []byte, salt []byte) (serializedHash string) {
	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)

	serializedHash = fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s", argon2.Version, a.memory, a.iterations, a.parallelism, b64Salt, b64Hash)
	return serializedHash
}

var (
	ErrInvalidHashFormat      = errors.New("invalid hash format")
	ErrHashVerificationFailed = errors.New("hash verification failed")
)

// DeserializeHashWithSalt implements the Hasher interface for Argon2id
// Extract the hash and salt from a serialized hash string
func (a *Argon2Hasher) DeserializeHashWithSalt(serializedHash string) (hash []byte, salt []byte, err error) {
	parts := strings.Split(serializedHash, "$")
	if len(parts) != 6 {
		return nil, nil, ErrInvalidHashFormat
	}

	salt, err = base64.RawStdEncoding.DecodeString(parts[4])
	if err != nil {
		return nil, nil, err
	}

	hash, err = base64.RawStdEncoding.DecodeString(parts[5])
	if err != nil {
		return nil, nil, err
	}

	return hash, salt, nil
}

// VerifyHashWithSalt implements the Hasher interface for Argon2id
// Verify a row unhashed value against the stored hash.
// toVerifyRawString: the raw unhashed string to verify
// originalHash: the stored hash to verify against
func (a *Argon2Hasher) VerifyHashWithSalt(toVerifyRawString, originalHash string) error {
	storedHash, salt, err := a.DeserializeHashWithSalt(originalHash)
	if err != nil {
		return err
	}

	toHash, _ := a.HashWithSalt(toVerifyRawString, salt)

	// to prevent timing attacks
	if subtle.ConstantTimeCompare(storedHash, []byte(toHash)) == 1 {
		return nil
	}

	return ErrHashVerificationFailed
}
