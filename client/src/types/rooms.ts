export interface Room {
    id: string;
    name: string;
    groupId: string;
    type: string;
}

export interface RoomsGroup {
    id: string;
    name: string;
    rooms: Room[];
}