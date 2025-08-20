import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
    component: RouteComponent,
    beforeLoad: ({ context }) => {
        if (context?.auth) {
            throw redirect({
                to: '/chat',
            })
        }
    }
})

function RouteComponent() {
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <main className='max-w-md w-full p-4'>
                <Outlet />
            </main>
        </div>
    )
}
