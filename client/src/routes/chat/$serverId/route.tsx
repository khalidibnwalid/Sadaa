import { createTreeItems, TreeBody, type Node } from '@/components/ui/tree'
import ContextMenu from '@/components/ui/ContextMenu'
import { createRoomsGroupsCollection } from '@/libs/collections/rooms'
import { TreeView } from '@ark-ui/react/tree-view'
import { useLiveQuery } from '@tanstack/react-db'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useMemo, useState, useRef } from 'react'
import { FaChevronDown, FaHashtag, FaPlus } from 'react-icons/fa'
import { PiSquaresFourThin } from 'react-icons/pi'
import z from 'zod'
import NewRoomsGroupDialog from '../-components/NewRoomsGroupDialog'
import NewRoomDialog from '../-components/NewRoomDialog'
import Button from '@/components/ui/Button'
import type { Room } from '@/types/rooms'

export const Route = createFileRoute('/chat/$serverId')({
  component: RouteComponent,
  beforeLoad: ({ params: { serverId }, context: { graphqlClient, queryClient } }) => {
    if (!z.string().uuid().safeParse(serverId).success) {
      throw redirect({
        to: '/chat',
      })
    }

    return {
      roomsGroupsCollection: createRoomsGroupsCollection(graphqlClient, queryClient, serverId),
    }
  },
})

const NEW_ROOM_PLACEHOLDER_ID = 'NEW_ROOM'

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { serverId } = Route.useParams()
  const { roomsGroupsCollection, serversCollection } = Route.useRouteContext()
  const { data: roomsGroups } = useLiveQuery(roomsGroupsCollection)

  const [isOpen, setIsOpen] = useState(false)
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false)
  const targetGroupIdRef = useRef<string | null>(null)

  const onAddRoom = async (room: Pick<Room, 'name' | 'type'>) => {
    const targetGroupId = targetGroupIdRef.current
    if (!targetGroupId || !roomsGroupsCollection) return

    roomsGroupsCollection.update(targetGroupId, {}, (draft) => {
      // might become a problem when I add requests batching/debouncing
      draft.rooms = [...(draft.rooms ?? []), {
        id: NEW_ROOM_PLACEHOLDER_ID,
        name: room.name,
        groupId: targetGroupId,
        type: room.type,
        orderIndex: (draft.rooms?.length ?? 0) + 1,
      }]
    })
    setIsRoomDialogOpen(false)
    targetGroupIdRef.current = null
  }

  const roomsGroupsTree = useMemo(() => {
    if (!roomsGroups) {
      return createTreeItems({
        nodeToValue: (node) => node.id,
        nodeToString: (node) => node.name,
        rootNode: { id: 'ROOT', name: '', children: [] },
      })
    }
    const rootNode = {
      id: 'ROOT',
      name: '',
      children: roomsGroups.map(group => ({
        id: group.id,
        name: group.name,
        icon: <FaChevronDown size={12} />,
        endContent: (
          <Button
            variant='ghost'
            onClick={(e) => {
              e.stopPropagation()
              targetGroupIdRef.current = group.id
              setIsRoomDialogOpen(true)
            }}
          >
            <FaPlus size={10} className='text-background' />
          </Button>
        ),
        children: group.rooms?.map(room => ({
          id: room.id,
          name: room.name,
          icon: <FaHashtag size={12} />,
        })) as Node[] ?? [],
      })) as Node[],
    }

    return createTreeItems({
      nodeToValue: (node) => node.id,
      nodeToString: (node) => node.name,
      rootNode,
    })
  }, [roomsGroups])

  const server = serversCollection.state.get(serverId)?.server!
  if (!server) navigate({ to: '/chat' })

  return (
    <div className='flex flex-row'>
      <NewRoomsGroupDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        roomsNumber={roomsGroups?.length ?? 0}
      />
      <NewRoomDialog
        isOpen={isRoomDialogOpen}
        setIsOpen={setIsRoomDialogOpen}
        onAddRoom={onAddRoom}
      />
      <section className=' w-3xs text-muted-foreground py-4 px-2 bg-muted/20 space-y-2'>
        <div className='flex flex-col bg-muted-foreground text-background p-3 rounded-xl'>
          <span className='text-xl font-bold'>{server.name}</span>
        </div>
        <ContextMenu.Root>
          <ContextMenu.Area className='w-full h-full grid items-start'>
            <TreeView.Root collection={roomsGroupsTree}>
              <TreeView.Tree>
                {roomsGroupsTree.rootNode.children?.map((node, index) => (
                  <TreeBody key={node.id} node={node} indexPath={[index]} />
                ))}
              </TreeView.Tree>
            </TreeView.Root>
          </ContextMenu.Area>
          <ContextMenu.Body>
            <ContextMenu.Item
              value='new Group'
              startContent={<PiSquaresFourThin />}
              onSelect={() => setIsOpen(true)}
            >
              New Group
            </ContextMenu.Item>
          </ContextMenu.Body>
        </ContextMenu.Root>
      </section>
      <Outlet />
    </div>
  )
}
