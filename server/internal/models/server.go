package models

import "github.com/khalidibnwalid/sadaa/server/internal/db"

// I already can Imagine the headache from having a model named `Server`
type Server struct {
	*db.Server
	RoomsGroups []*RoomsGroup
}

// Cast *db.Server to *Server
func NewServer(s ...*db.Server) *Server {
	if len(s) > 0 {
		return &Server{s[0], make([]*RoomsGroup, 0)}
	}
	return &Server{&db.Server{}, make([]*RoomsGroup, 0)}
}
