import { createTreeItems, TreeBody } from '@/components/sidetree'
import { TreeView } from '@ark-ui/react/tree-view'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import z from 'zod'

const MOCK_ITEMS = createTreeItems({
  nodeToValue: (node) => node.id,
  nodeToString: (node) => node.name,
  rootNode: {
    id: 'ROOT',
    name: '',
    children: [
      {
        id: 'general-category',
        name: 'General',
        children: [
          { id: 'general', name: 'general' },
          { id: 'random', name: 'random' },
          { id: 'voice-general', name: 'Voice 1' },
        ],
      },
      {
        id: 'dev-category',
        name: 'Development',
        children: [
          { id: 'dev-chat', name: 'dev-chat' },
          { id: 'dev-help', name: 'help' },
        ],
      },
      {
        id: 'music-category',
        name: 'Music',
        children: [
          { id: 'music', name: 'music' },
          { id: 'voice-music', name: 'Voice 2' },
        ],
      },
    ],
  },
})

export const Route = createFileRoute('/chat/$serverId')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    const { serverId } = params
    if (z.string().uuid().safeParse(serverId).success === false) {
      throw redirect({
        to: '/chat',
      })
    }
  }
})

function RouteComponent() {
  return (
    <div className='flex flex-row'>
      <div className=' w-3xs text-muted-foreground py-4 px-2 bg-radial to-muted/20 space-y-2'>
        <div className='flex flex-col bg-muted-foreground text-background p-3 rounded-xl'>
          <span className='text-xl font-bold'>SERVER_NAME</span>
          {/* <span className='text-xs text-muted-foreground'>#{MOCK_ITEMS.rootNode.name}</span> */}
        </div>
        <TreeView.Root collection={MOCK_ITEMS}>
          <TreeView.Tree>
            {MOCK_ITEMS.rootNode.children?.map((node, index) => (
              <TreeBody key={node.id} node={node} indexPath={[index]} />
            ))}
          </TreeView.Tree>
        </TreeView.Root>
      </div>
      <Outlet />
    </div>
  )
}
