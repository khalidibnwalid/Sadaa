import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/$serverId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/chat/$serverId/"!</div>
}
