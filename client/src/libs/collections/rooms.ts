import type { RoomsGroup } from '@/types/rooms'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import type { QueryClient } from '@tanstack/react-query'
import type { GraphQLClient } from 'graphql-request'
import { CREATE_ROOMS_GROUP_MUTATION, ROOMS_GROUPS_QUERY } from '../graphql/rooms'

const QUERY_STALE_TIME = 1000 * 60 * 5 // 5 minutes
const QUERY_KEY = 'rooms-groups'

const PLACEHOLDER_ID = 'NEW_ROOM_GROUP'

export const createRoomsGroupsCollection = (
    graphQLClient: GraphQLClient,
    queryClient: QueryClient,
    serverId: string
) => createCollection(
    queryCollectionOptions({
        queryKey: [QUERY_KEY, serverId],
        queryFn: async () => {
            const result = await graphQLClient.request(ROOMS_GROUPS_QUERY, {
                serverId,
            });
            return result.roomsGroups as RoomsGroup[];
        },
        queryClient,
        getKey: (room) => room.id,
        staleTime: QUERY_STALE_TIME,
        // Only supports single insertion
        onInsert: async ({ transaction }) => {
            const roomGroup = transaction?.mutations?.[0]?.modified
            if (!roomGroup) return { refetch: true }

            // Optimistic update 
            // (idk if I did something wrong, but the docs don't explicitly reset the cache after a mutation)
            queryClient.setQueryData([QUERY_KEY, serverId], (old: RoomsGroup[] | undefined) => {
                if (!old) return [roomGroup]
                return [...old, roomGroup]
            })

            const { createRoomsGroup } = await graphQLClient.request(CREATE_ROOMS_GROUP_MUTATION, {
                input: {
                    serverId,
                    name: roomGroup.name,
                    orderIndex: roomGroup.orderIndex,
                },
            })

            queryClient.setQueryData([QUERY_KEY, serverId], (old: RoomsGroup[] | undefined) => {
                if (!old) return [roomGroup]
                return old.map(rg => rg.id === PLACEHOLDER_ID ? {...createRoomsGroup, rooms: []} : rg)
            })

            return { refetch: false }
        },
        // onDelete
        // onUpdate
    })
)