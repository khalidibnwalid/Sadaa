export interface Room {
    id: string;
    name: string;
    groupId: string;
    type: "TEXT" | "VOICE";
    orderIndex: number;
}

export interface RoomsGroup {
    id: string;
    name: string;
    rooms: Room[];
    orderIndex: number;
    serverId: string;
}