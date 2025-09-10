import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { PiX } from 'react-icons/pi';
import Button from './Button';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

type DialogProps = DivProps & {
    open: boolean;
    onClose: () => void;
}

function Dialog({
    open,
    onClose,
    children,
    className,
    ...props
}: DialogProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        };
        if (open) document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onClose]);

    return open && ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-pure/20 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                ref={ref}
                className="relative border border-border bg-background text-foreground rounded-3xl p-4 min-w-sm"
                onClick={e => e.stopPropagation()}
                {...props}
            >
                <Button
                    variant='ghost'
                    className="absolute top-2 right-2 text-foreground hover:text-muted-danger"
                    onClick={onClose}
                    aria-label="Close dialog"
                >
                    <PiX size={24} />
                </Button>
                {children}
            </div>
        </div>,
        document.body
    );
}

export default Dialog;
