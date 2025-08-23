package resolvers

import "errors"

var (
	ErrInternalServerError = errors.New("internal server error")
	ErrUnauthorized         = errors.New("unauthorized")
	ErrNotFound             = errors.New("not found")

	// signup page does tell you if email is used or not, I don't see a point in saying "wrong email or password"
	ErrUserNotFound        = errors.New("user not found")
	ErrInvalidPassword     = errors.New("invalid password")
	ErrInvalidEmailAddress = errors.New("invalid email address")
	ErrEmailExists         = errors.New("email already exists")
	ErrUsernameExists      = errors.New("username already exists")
	ErrFailedToCreateAuthSession = errors.New("failed to create authentication session")
)
