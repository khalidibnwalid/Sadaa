import Button from "@/components/ui/Button"
import type { Server } from "@/types/servers"
import { ChatCircleIcon, PlusIcon } from "@phosphor-icons/react"
import { useLocation } from "@tanstack/react-router"
import { twJoin } from 'tailwind-merge'

const MOCK_DATA: Server[] = [
    { id: 1, name: "Chat 1", iconUrl: "" },
    { id: 2, name: "Chat 2", iconUrl: "https://placehold.co/50" },
    { id: 3, name: "Chat 3", iconUrl: "" },
]

export default function ChatSidebar() {
    const location = useLocation()

    return (
        <nav className='h-screen flex flex-col p-2'>
            <ul className='space-y-2'>
                <SidebarButton
                    // link=""
                    text="chats"
                    isActive={location.pathname === '/chat'}
                >
                    <ChatCircleIcon size={26} weight="fill" />
                </SidebarButton>
                {MOCK_DATA.map((server) => (
                    <li key={server.id}>
                        <SidebarButton
                            text={server.name}
                            img={server.iconUrl}
                            isActive={location.pathname === `/chat/${server.id}`}
                        />
                    </li>
                ))}
                <SidebarButton
                    text="add server"
                >
                    <PlusIcon size={26} />
                </SidebarButton>
            </ul>
        </nav>
    )
}

function SidebarButton({
    text,
    img,
    isActive,
    children
}: {
    text: string
    img?: string
    isActive?: boolean
    children?: React.ReactNode
    // link?: keyof FileRoutesByTo
}) {
    return (
        <Button
            variant="filledOutline"
            className={twJoin(
                'relative group font-bold text-xl size-14 flex items-center justify-center rounded-3xl px-0 py-0',
                isActive && 'bg-foreground text-background border-foreground'
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
