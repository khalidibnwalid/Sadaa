import { gql } from "@/__generated__/gql";

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
