package models

import (
	"encoding/json"

	"github.com/khalidibnwalid/sadaa/server/internal/platforms/db"
)

type Room struct {
	*db.Room
}

type RoomsGroup struct {
	*db.RoomsGroup
	Rooms []*Room
}

func NewRoomsGroup(roomsGroup *db.RoomsGroup, rooms []*db.Room) *RoomsGroup {
	_rooms := make([]*Room, len(rooms))
	for i := range rooms {
		_rooms[i] = &Room{Room: rooms[i]}
	}
	return &RoomsGroup{
		RoomsGroup: roomsGroup,
		Rooms:      _rooms,
	}
}

func RoomsFromBytes(data []byte) ([]*Room, error) {
	var rooms []*Room
	if err := json.Unmarshal(data, &rooms); err != nil {
		return nil, err
	}
	return rooms, nil
}

func NewRoom(room *db.Room) *Room {
	return &Room{
		Room: room,
	}
}
