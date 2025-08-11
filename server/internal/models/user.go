package models

import (
	"net/mail"

	"github.com/khalidibnwalid/sadaa/server/internal/crypto"
	"github.com/khalidibnwalid/sadaa/server/internal/db"
)

type User struct {
	*db.User
}

// Cast *db.User to *User
func NewUser(u ...*db.User) *User {
	if len(u) > 0 {
		return &User{u[0]}
	}
	return &User{&db.User{}}
}

// Hashes a password and stores the serialized hash in the User model.
func (u *User) WithPassword(password string) *User {
	hasher := crypto.NewArgon2idHasher()
	hash, salt := hasher.HashWithSalt(password)
	serialized := hasher.SerializeHashWithSalt(hash, salt)
	u.User.HashedPassword = serialized
	return u
}

// Verifies a password against the stored hash in the User model.
func (u *User) VerifyPassword(password string) error {
	hasher := crypto.NewArgon2idHasher()
	return hasher.VerifyHashWithSalt(password, u.User.HashedPassword)
}

// Validates the email format and stores it in the User model.
func (u *User) WithEmail(email string) error {
	mailAddr, err := mail.ParseAddress(email)

	if err != nil {
		return err
	}

	u.User.Email = mailAddr.Address
	return nil
}