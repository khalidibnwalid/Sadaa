import { createFileRoute, Outlet } from '@tanstack/react-router'
import Sidebar from './-components/sidebar'

export const Route = createFileRoute('/chat')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className='flex flex-row w-full h-screen'>
            <Sidebar />
            <Outlet />
        </div>
    )
}
