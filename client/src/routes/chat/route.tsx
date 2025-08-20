import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import Sidebar from './-components/sidebar'
import type { RouterContext } from '@/main';

export const Route = createFileRoute('/chat')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        if (!context?.auth) {
            throw redirect({
                to: '/login',
            })
        }

        return {
            auth: context.auth as NonNullable<RouterContext['auth']>,
        }
    }
})

function RouteComponent() {
    return (
        <div className='flex flex-row w-full h-screen'>
            <Sidebar />
            <Outlet />
        </div>
    )
}
