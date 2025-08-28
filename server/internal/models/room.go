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

func NewRoomsGroup(roomsGroup *db.RoomsGroup, rooms ...[]*Room) *RoomsGroup {
	_rooms := make([]*Room, 0)
	if len(rooms) > 0 {
		_rooms = rooms[0]
	}
	return &RoomsGroup{
		RoomsGroup: roomsGroup,
		Rooms:      _rooms,
	}
}

func NewRoom(room *db.Room) *Room {
	return &Room{
		Room: room,
	}
}