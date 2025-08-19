import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const button = cva(
    "cursor-pointer rounded-2xl px-4 py-2 duration-200 font-semibold",
    {
        variants: {
            variant: {
                default: "bg-foreground text-background hover:bg-foreground/80",
                outline: "border-2 border-border text-foreground hover:border-foreground",
                filledOutline: "border-2 border-border text-foreground bg-transparent hover:bg-foreground hover:text-background  hover:border-foreground",
                ghost: "text-foreground/80 hover:text-foreground",
            },
            size: {
                sm: "text-sm",
                md: "text-base",
                lg: "text-lg ",
            },
            disabled: {
                false: null,
                true: "opacity-50 cursor-not-allowed",
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
            disabled: false,
        },
    });

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'filledOutline'
    size?: 'sm' | 'md' | 'lg'
}

export default function Button({
    className,
    variant,
    children,
    size,
    ...props
}: ButtonProps) {
    return (
        <button
            className={twMerge(button({ variant, className, size, disabled: props.disabled }), className)}
            {...props}
        >
            {children}
        </button>
    )
}