package models

import (
	"github.com/khalidibnwalid/sadaa/server/internal/db"
)

type ServerMember struct {
	*db.ServerMember
	Server *db.Server `json:"server"`
}


func NewServerMember(sm *db.ServerMember, server *db.Server) *ServerMember {
	return &ServerMember{
		ServerMember: sm,
		Server:       server,
	}
}