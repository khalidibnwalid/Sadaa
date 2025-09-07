
export interface Server {
    id: string
    name: string
    coverUrl?: string | null
}

export interface ServerMembership {
    userId: string
    serverId: string
    nickname?: string | null
    server: Server
}