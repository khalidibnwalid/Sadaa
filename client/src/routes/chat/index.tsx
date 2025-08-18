import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <div className='w-full h-full'>
        Hello "/chat/"!
      </div>
  )
}
