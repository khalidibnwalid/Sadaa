
export interface Server {
    id: number
    name: string
    coverUrl: string
}

export interface ServerMembership {
    userId: string
    serverId: string
    nickname?: string | null
    server: Server
}