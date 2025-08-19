import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <main className='max-w-md w-full p-4 bg-radial to-foreground/5 from-foreground/15 border-border/10 border-2 duration-200 inset-40 rounded-4xl transition-all'>
                <Outlet />
            </main>
        </div>
    )
}
