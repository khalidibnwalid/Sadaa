import { SERVER_MEMBERSHIPS_QUERY } from '@/libs/graphql/server';
import type { RouterContext } from '@/main';
import type { ServerMembership } from '@/types/servers';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import Sidebar from './-components/sidebar';

export const Route = createFileRoute('/chat')({
    component: RouteComponent,
    beforeLoad: async ({ context: { auth, graphqlClient, queryClient } }) => {
        if (!auth) {
            throw redirect({
                to: '/login',
            })
        }

        let servers: ServerMembership[] = []
        try {
            servers = (await graphqlClient.request(SERVER_MEMBERSHIPS_QUERY)).serverMemberships satisfies ServerMembership[]
            queryClient.setQueryData([SERVER_MEMBERSHIPS_QUERY], servers)

        } catch (error) {
            console.error(error);
        }

        return {
            auth: auth as NonNullable<RouterContext['auth']>,
            servers,
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
