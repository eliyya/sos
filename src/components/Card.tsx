import { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

export const Card = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'bg-card text-card-foreground rounded-lg border shadow-xs',
            className,
        )}
        {...props}
    />
)

export const CardHeader = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        {...props}
    />
)

export const CardTitle = ({
    className,
    ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
    <h3
        className={cn(
            'text-2xl leading-none font-semibold tracking-tight',
            className,
        )}
        {...props}
    />
)

export const CardDescription = ({
    className,
    ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn('text-muted-foreground text-sm', className)} {...props} />
)

export const CardContent = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('p-6 pt-0', className)} {...props} />
)

export const CardFooter = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
)
