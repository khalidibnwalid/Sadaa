import { RadioGroup } from '@ark-ui/react'
import { twMerge } from 'tailwind-merge'

type ContainerProps = RadioGroup.RootProps & {
    value: string
    onChange: (value: string) => void
    className?: string
    children?: React.ReactNode
}

function Container({ value, onChange, className, children, ...props }: ContainerProps) {
    return (
        <RadioGroup.Root
            {...props}
            value={value}
            onValueChange={(details) => details.value && onChange(details.value)}
            className={twMerge("flex gap-2", className)}
        >
            {children}
        </RadioGroup.Root>)
}

type ItemProps = RadioGroup.ItemProps & {
    value: string
    label: string
    className?: string
    children?: React.ReactNode
}

function Item({ value, label = value, className, children, ...props }: ItemProps) {
    return (
        <RadioGroup.Item
            {...props}
            value={value}
            className={twMerge(
                "flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer border-border border-2 duration-150 transition-colors text-center",
                "data-[state=checked]:bg-foreground data-[state=checked]:text-background data-[state=checked]:border-foreground",
                "hover:bg-foreground/10 focus-within:outline-4 outline-primary",
                className
            )}
            aria-label={label}
            asChild
        >
            <label>
                {children}
                <RadioGroup.ItemControl />
                <RadioGroup.ItemText>{label}</RadioGroup.ItemText>
                <RadioGroup.ItemHiddenInput />
            </label>
        </RadioGroup.Item>
    )
}

export default {
    Container,
    Item,
}