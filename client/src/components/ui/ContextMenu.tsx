import { Menu } from '@ark-ui/react/menu'
import { twMerge } from 'tailwind-merge'

const Area = Menu.ContextTrigger
const Root = Menu.Root
const Separator = Menu.Separator

type BodyProps = Menu.ContentProps & { children: React.ReactNode }

function Body({ children, className, ...props }: BodyProps) {
    return (
        <Menu.Positioner>
            <Menu.Content
                className={
                    twMerge(
                        'bg-background/70 backdrop-blur-md p-1 rounded-xl border border-border min-w-[12rem]',
                        className
                    )}
                {...props}
            >
                {children}
            </Menu.Content>
        </Menu.Positioner>
    )
}

type ItemProps = Menu.ItemProps & {
    startContent?: React.ReactNode,
    endContent?: React.ReactNode,
    children?: React.ReactNode
}

function Item({ startContent, endContent, children, className, ...props }: ItemProps) {
    return (
        <Menu.Item
            className={
                twMerge('cursor-pointer px-2 py-1 rounded-lg hover:bg-foreground/10 flex items-center gap-2 duration-150',
                    className
                )}
            {...props}
        >
            {startContent &&
                <Menu.Indicator className='text-xl'>{startContent}</Menu.Indicator>
            }
            {children}
            {endContent &&
                <Menu.Indicator className='text-xl'>{endContent}</Menu.Indicator>
            }
        </Menu.Item>
    )
}

export default {
    Root,
    Area,
    Separator,
    Body,
    Item,
};