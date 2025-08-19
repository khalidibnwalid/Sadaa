import { Field, useField } from '@ark-ui/react/field'
import { twJoin, twMerge } from 'tailwind-merge'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    subText?: string
    onValueChange?: (value: string) => void
}

export default function Input({ label, error, subText, className, onValueChange, ...props }: InputProps) {
    const value = useField({
        invalid: Boolean(error),
    })

    return (
        <Field.RootProvider className='space-y-1' value={value}>
            <Field.Label className='block px-1 text-muted-foreground text-base'>{label}</Field.Label>
            <Field.Input
                className={twMerge(
                    'w-full border-border border-2 rounded-2xl py-1 px-3 text-lg hover:border-foreground duration-200',
                    value.invalid && 'border-muted-danger bg-muted-danger/10',
                    className,
                )}
                onChange={(e) => {
                    onValueChange?.(e.target.value)
                    props.onChange?.(e)
                }}
                {...props}
            />
            <Field.HelperText>{subText}</Field.HelperText>
            <Field.ErrorText className='block px-1 text-muted-danger text-sm'>{error}</Field.ErrorText>
        </Field.RootProvider >
    )
}