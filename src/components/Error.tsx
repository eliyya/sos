import { cn } from '@/lib/utils'

export function MessageError({
    children,
    className,
    ...props
}: React.HTMLProps<HTMLSpanElement>) {
    return (
        <span
            {...props}
            className={cn(
                'animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md',
                className,
            )}
        >
            {children}
        </span>
    )
}
