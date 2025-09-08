import { createTreeItems, TreeBody } from '@/components/sidetree'
import { createRoomsGroupsCollection } from '@/libs/collections/rooms'
import { TreeView } from '@ark-ui/react/tree-view'
import { useLiveQuery } from '@tanstack/react-db'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { useMemo } from 'react'
import z from 'zod'

export const Route = createFileRoute('/chat/$serverId')({
  component: RouteComponent,
  beforeLoad: ({ params, context: { graphqlClient, queryClient } }) => {
    const { serverId } = params
    if (z.string().uuid().safeParse(serverId).success === false) {
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
    // If roomsGroups is not loaded yet, fallback to empty tree
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
        children: group.rooms?.map(room => ({
          id: room.id,
          name: room.name,
        })) ?? [],
      })),
    }

    return createTreeItems({
      nodeToValue: (node) => node.id,
      nodeToString: (node) => node.name,
      rootNode,
    })
  }, [roomsGroups])

  const server = serversCollection.state.get(serverId)?.server!
  if (!server) navigate({ to: '/chat' }) // to actually assert

  return (
    <div className='flex flex-row'>
      <div className=' w-3xs text-muted-foreground py-4 px-2 bg-muted/20 space-y-2'>
        <div className='flex flex-col bg-muted-foreground text-background p-3 rounded-xl'>
          <span className='text-xl font-bold'>{server.name}</span>
          {/* <span className='text-xs text-muted-foreground'>#{roomsGroupsTree.rootNode.name}</span> */}
        </div>
        <TreeView.Root collection={roomsGroupsTree}>
          <TreeView.Tree>
            {roomsGroupsTree.rootNode.children?.map((node, index) => (
              <TreeBody key={node.id} node={node} indexPath={[index]} />
            ))}
          </TreeView.Tree>
        </TreeView.Root>
      </div>
      <Outlet />
    </div>
  )
}
