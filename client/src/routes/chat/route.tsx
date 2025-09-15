import { createServersCollection } from '@/libs/collections/servers';
import type { RouterContext } from '@/main';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import Sidebar from './-components/sidebar';

export const Route = createFileRoute('/chat')({
    component: RouteComponent,
    beforeLoad: async ({ context: { auth, graphqlClient, queryClient } }) => {
        if (!auth?.user) {
            throw redirect({
                to: '/login',
            })
        }

        return {
            auth: auth as NonNullable<RouterContext['auth']>,
            serversCollection: createServersCollection(graphqlClient, queryClient),
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
