package models

import (
	"github.com/khalidibnwalid/sadaa/server/internal/db"
)

type Room struct {
	*db.Room
}

type RoomsGroup struct {
	*db.RoomsGroup
	Rooms []*Room
}