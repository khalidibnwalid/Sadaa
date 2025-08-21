package models

import "github.com/khalidibnwalid/sadaa/server/internal/db"

// I already can Imagine the headache from having a model named `Server`
type Server struct {
	*db.Server
}

// Cast *db.User to *User
func NewServer(s ...*db.Server) *Server {
	if len(s) > 0 {
		return &Server{s[0]}
	}
	return &Server{&db.Server{}}
}
