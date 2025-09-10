import { createTreeItems, TreeBody, type Node } from '@/components/ui/tree'
import ContextMenu from '@/components/ui/ContextMenu'
import { createRoomsGroupsCollection } from '@/libs/collections/rooms'
import { TreeView } from '@ark-ui/react/tree-view'
import { useLiveQuery } from '@tanstack/react-db'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { FaChevronDown, FaHashtag } from 'react-icons/fa'
import { PiSquaresFourThin } from 'react-icons/pi'
import z from 'zod'
import NewRoomsGroupDialog from '../-components/NewRoomsGroupDialog'

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

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { serverId } = Route.useParams()
  const { roomsGroupsCollection, serversCollection } = Route.useRouteContext()
  const { data: roomsGroups } = useLiveQuery(roomsGroupsCollection)

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
        children: group.rooms?.map(room => ({
          id: room.id,
          name: room.name,
          icon: <FaHashtag size={12} />,
        })) ?? [],
      })) as Node[],
    }

    return createTreeItems({
      nodeToValue: (node) => node.id,
      nodeToString: (node) => node.name,
      rootNode,
    })
  }, [roomsGroups])

  const [isOpen, setIsOpen] = useState(false)
  const server = serversCollection.state.get(serverId)?.server!
  if (!server) navigate({ to: '/chat' })

  return (
    <div className='flex flex-row'>
      <NewRoomsGroupDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        roomsNumber={roomsGroups?.length ?? 0}
      />
      <div className=' w-3xs text-muted-foreground py-4 px-2 bg-muted/20 space-y-2'>
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
      </div>
      <Outlet />
    </div>
  )
}
