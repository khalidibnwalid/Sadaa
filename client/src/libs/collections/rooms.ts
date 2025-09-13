import type { Room } from '@/__generated__/gql/graphql'
import type { RoomsGroup } from '@/types/rooms'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { createCollection } from '@tanstack/react-db'
import type { QueryClient } from '@tanstack/react-query'
import type { GraphQLClient } from 'graphql-request'
import { CREATE_ROOM_MUTATION, CREATE_ROOMS_GROUP_MUTATION, ROOMS_GROUPS_QUERY } from '../graphql/rooms'

const QUERY_STALE_TIME = 1000 * 60 * 5 // 5 minutes
const QUERY_KEY = 'rooms-groups'

const ROOMGROUP_PLACEHOLDER_ID = 'NEW_ROOM_GROUP'
const ROOM_PLACEHOLDER_ID = 'NEW_ROOM'

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
        // Only supports single insertion, since a user is prompted to add one group at a time
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
                return old.map(rg => rg.id === ROOMGROUP_PLACEHOLDER_ID ? { ...createRoomsGroup, rooms: [] } : rg)
            })

            return { refetch: false }
        },
        // currently only supports adding a single room to a group (for the same reason as above)
        onUpdate: async ({ transaction }) => {
            // Diffing logic for adding a new room
            const activeGroupId = transaction?.mutations?.[0]?.key
            const changes = transaction?.mutations?.[0]?.changes
            if (!activeGroupId || !changes) return { refetch: true }
            let newRoom: Omit<Room, 'createdAt' | 'updatedAt'> | undefined;

            // optimistic update
            queryClient.setQueryData([QUERY_KEY, serverId], (old: RoomsGroup[]) =>
                old.map(group => {
                    if (group.id !== activeGroupId) return group

                    const newRoomEntity = (changes.rooms ?? []).find(r => r.id === ROOM_PLACEHOLDER_ID)
                    if (!newRoomEntity) return group

                    newRoom = { ...newRoomEntity, serverId: group.serverId };

                    return {
                        ...group,
                        rooms: [...(group.rooms ?? []), newRoomEntity],
                    }
                }))

            //gql request
            const { createRoom } = await graphQLClient.request(CREATE_ROOM_MUTATION, {
                input: {
                    name: newRoom?.name!,
                    groupId: newRoom?.groupId!,
                    type: newRoom?.type!,
                    orderIndex: newRoom?.orderIndex!,
                    serverId: newRoom?.serverId!,
                },
            })


            queryClient.setQueryData([QUERY_KEY, serverId], (old: RoomsGroup[]) =>
                old.map(group => {
                    if (group.id !== activeGroupId) return group;
                    return {
                        ...group,
                        rooms: (group.rooms ?? []).map(room =>
                            room.id === ROOM_PLACEHOLDER_ID ? createRoom : room
                        ),
                    };
                }));

            return { refetch: false }
        }
        // onDelete
    })
)