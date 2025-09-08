import type { RoomsGroup } from '@/types/rooms'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import type { QueryClient } from '@tanstack/react-query'
import type { GraphQLClient } from 'graphql-request'
import { ROOMS_GROUPS_QUERY } from '../graphql/rooms'

const QUERY_STALE_TIME = 1000 * 60 * 5 // 5 minutes

export const createRoomsGroupsCollection = (
    graphQLClient: GraphQLClient,
    queryClient: QueryClient,
    serverId: string
) => createCollection(
    queryCollectionOptions({
        queryKey: ['rooms-groups', serverId],
        queryFn: async () => {
            const result = await graphQLClient.request(ROOMS_GROUPS_QUERY, {
                serverId,
            });
            return result.roomsGroups as RoomsGroup[];
        },
        queryClient,
        getKey: (room) => room.id,
        staleTime: QUERY_STALE_TIME,
        // onDelete
        // onInsert
        // onUpdate
    })
)