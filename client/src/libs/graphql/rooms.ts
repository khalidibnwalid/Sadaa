import { gql } from "@/__generated__/gql";

// # Rooms

export const CREATE_ROOM_MUTATION = gql(`
	mutation CreateRoom($input: CreateRoomInput!) {
		createRoom(input: $input) {
			orderIndex
			groupId
			serverId
			type
			name
		}
	}
`);

// # Rooms Groups

export const ROOMS_GROUPS_QUERY = gql(`
	query RoomsGroups($serverId: UUID!) {
		roomsGroups(serverId: $serverId) {
			id
			name
			rooms { 
				id 
				name 
				groupId 
				type
			}
		}
	}
`);

export const CREATE_ROOMS_GROUP_MUTATION = gql(`
	mutation CreateRoomsGroup($input: CreateRoomsGroupInput!) {
		createRoomsGroup(input: $input) {
			id
			name
			orderIndex
			serverId
		}
	}
`);
