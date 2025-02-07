'use client'

import {
    Action,
    Close,
    Description,
    Provider,
    Root,
    Title,
    Viewport,
} from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { ReactElement, ComponentProps } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const ToastProvider = Provider

export const ToastViewport = ({
    className,
    ...props
}: ComponentProps<typeof Viewport>) => (
    <Viewport
        className={cn(
            'fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4',
            'sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col',
            'md:max-w-[420px]',
            className,
        )}
        {...props}
    />
)

ToastViewport.displayName = Viewport.displayName

const toastVariants = cva(
    'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full sm:data-[state=open]:slide-in-from-bottom-full',
    {
        variants: {
            variant: {
                default: 'border bg-background text-foreground',
                destructive:
                    'destructive group border-destructive bg-destructive text-destructive-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
)

export const Toast = ({
    className,
    variant,
    ...props
}: ComponentProps<typeof Root> & VariantProps<typeof toastVariants>) => {
    return (
        <Root
            className={cn(toastVariants({ variant }), className)}
            {...props}
        />
    )
}

export const ToastAction = ({
    className,
    ...props
}: ComponentProps<typeof Action>) => (
    <Action
        className={cn(
            'ring-offset-background hover:bg-secondary focus:ring-ring group-[.destructive]:border-muted/40 hover:group-[.destructive]:border-destructive/30 hover:group-[.destructive]:bg-destructive hover:group-[.destructive]:text-destructive-foreground focus:group-[.destructive]:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50',
            className,
        )}
        {...props}
    />
)

export const ToastClose = ({
    className,
    ...props
}: ComponentProps<typeof Close>) => (
    <Close
        className={cn(
            'text-foreground/50 hover:text-foreground absolute top-2 right-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:group-[.destructive]:text-red-50 focus:opacity-100 focus:ring-2 focus:outline-hidden focus:group-[.destructive]:ring-red-400 focus:group-[.destructive]:ring-offset-red-600',
            className,
        )}
        toast-close=""
        {...props}
    >
        <X className="h-4 w-4" />
    </Close>
)

export const ToastTitle = ({
    className,
    ...props
}: ComponentProps<typeof Title>) => (
    <Title className={cn('text-sm font-semibold', className)} {...props} />
)

export const ToastDescription = ({
    className,
    ...props
}: ComponentProps<typeof Description>) => (
    <Description className={cn('text-sm opacity-90', className)} {...props} />
)

export type ToastProps = ComponentProps<typeof Toast>

export type ToastActionElement = ReactElement<typeof ToastAction>
