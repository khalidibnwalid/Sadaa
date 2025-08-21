package models

import (
	"github.com/khalidibnwalid/sadaa/server/internal/db"
)

type ServerMember struct {
	*db.ServerMember
	Server *db.Server `json:"server"`
}
