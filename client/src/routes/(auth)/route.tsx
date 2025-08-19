import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
    component: RouteComponent,
})

// TODO: Check auth, redirect if logged in

function RouteComponent() {
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <main className='max-w-md w-full p-4'>
                <Outlet />
            </main>
        </div>
    )
}
