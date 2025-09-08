import type { ServerMembership } from '@/types/servers'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import type { QueryClient } from '@tanstack/react-query'
import type { GraphQLClient } from 'graphql-request'
import { SERVER_MEMBERSHIPS_QUERY } from '../graphql/server'

const QUERY_STALE_TIME = 1000 * 60 * 3 // 3 minutes

export const createServersCollection = (
    graphQLClient: GraphQLClient,
    queryClient: QueryClient
) => createCollection(
    queryCollectionOptions({
        queryKey: ['servers'],
        queryFn: async () => {
            const result = await graphQLClient.request(SERVER_MEMBERSHIPS_QUERY);
            return result.serverMemberships as ServerMembership[];
        },
        queryClient,
        getKey: (server) => server.serverId,
        staleTime: QUERY_STALE_TIME,
        // onDelete
        // onInsert
        // onUpdate
    })
)