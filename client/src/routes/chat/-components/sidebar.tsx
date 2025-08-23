import Button from "@/components/ui/Button"
import { ChatCircleIcon, PlusIcon } from "@phosphor-icons/react"
import { useLocation, useRouteContext } from "@tanstack/react-router"
import { twJoin } from 'tailwind-merge'

export default function ChatSidebar() {
    const { auth, servers } = useRouteContext({ from: '/chat' })
    const location = useLocation()

    return (
        <nav className='h-screen flex flex-col p-2'>
            <ul className='flex flex-col gap-y-2 h-full'>
                <SidebarButton
                    // link=""
                    text="chats"
                    isActive={location.pathname === '/chat'}
                >
                    <ChatCircleIcon size={26} weight="fill" />
                </SidebarButton>
                {servers.map(({ server }) => (
                    <li key={server.id}>
                        <SidebarButton
                            text={server.name}
                            img={server.coverUrl}
                            isActive={location.pathname === `/chat/${server.id}`}
                        />
                    </li>
                ))}
                <SidebarButton
                    text="add server"
                >
                    <PlusIcon size={26} />
                </SidebarButton>
                <div className='flex-1' ></div>
                <SidebarButton
                    text={auth.user.username}
                >
                </SidebarButton>
            </ul>
        </nav>
    )
}

function SidebarButton({
    text,
    img,
    isActive,
    className,
    children
}: {
    text: string
    img?: string
    isActive?: boolean
    className?: string
    children?: React.ReactNode
    // link?: keyof FileRoutesByTo
}) {
    return (
        <Button
            variant="filledOutline"
            className={twJoin(
                'relative group font-bold text-xl size-14 flex items-center justify-center rounded-3xl px-0 py-0',
                isActive && 'bg-foreground text-background border-foreground',
                className
            )}
            title={text}
        >
            {children ? children : img ? (
                <img src={img} alt={text} className='w-full h-full object-cover rounded-3xl' />
            ) : (
                <span className="-mx-1 uppercase">
                    {text?.[0] || "?"}
                </span>
            )}

            {/* Hover label */}
            <span
                className={twJoin(
                    "pointer-events-none absolute top-1/2 -translate-y-1/2 px-3 py-1 rounded-xl bg-foreground text-background text-base font-medium opacity-0 scale-95 duration-200 whitespace-nowrap z-50",
                    "group-hover:opacity-100 group-hover:scale-100 group-hover:ml-4",
                    "ltr:left-5/6 rtl:right-full ltr:ml-2 rtl:mr-2"
                )}
            >
                {text}
            </span>
        </Button>
    )
}
