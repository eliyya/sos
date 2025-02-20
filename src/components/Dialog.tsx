'use client'

import {
    Close,
    Content,
    Description,
    Overlay,
    Portal,
    Root,
    Title,
    Trigger,
} from '@radix-ui/react-dialog'
import { ComponentProps, forwardRef, ComponentRef, HTMLAttributes } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Dialog = Root

export const DialogTrigger = Trigger

export const DialogPortal = Portal

export const DialogClose = Close

export const DialogOverlay = ({
    className,
    ...props
}: ComponentProps<typeof Overlay>) => (
    <Overlay
        className={cn(
            'fixed inset-0 z-50 bg-black/80',
            // data-[state=open]:
            'data-[state=open]:fade-in-0 data-[state=open]:animate-in',
            // data-[state=closed]:
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
            className,
        )}
        {...props}
    />
)

export const DialogContent = forwardRef<
    ComponentRef<typeof Content>,
    ComponentProps<typeof Content>
>(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <Content
            ref={ref}
            className={cn(
                'bg-background fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200',
                // sm:
                'sm:rounded-lg',
                // data-[state=open]:
                'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
                // data-[state=closed]:
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
                className,
            )}
            {...props}
        >
            {children}
            <Close
                className={cn(
                    'ring-offset-background absolute right-4 top-4 cursor-pointer rounded-sm opacity-70 transition-opacity',
                    // focus:
                    'focus:ring-ring focus:outline-none focus:ring-2 focus:ring-offset-2',
                    // hover:
                    'hover:opacity-100',
                    // disabled:
                    'disabled:pointer-events-none',
                    // data-[state=open]:
                    'data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
                )}
            >
                <X className='h-4 w-4' />
                <span className='sr-only'>Close</span>
            </Close>
        </Content>
    </DialogPortal>
))
DialogContent.displayName = Content.displayName

export const DialogHeader = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex flex-col space-y-1.5 text-center',
            'sm:text-left',
            className,
        )}
        {...props}
    />
)

export const DialogFooter = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex flex-col-reverse',
            'sm:flex-row sm:justify-end sm:space-x-2',
            className,
        )}
        {...props}
    />
)

export const DialogTitle = ({
    className,
    ...props
}: ComponentProps<typeof Title>) => (
    <Title
        className={cn(
            'text-xl font-semibold leading-none tracking-tight',
            className,
        )}
        {...props}
    />
)

export const DialogDescription = ({
    className,
    ...props
}: ComponentProps<typeof Description>) => (
    <Description
        className={cn('text-muted-foreground text-sm', className)}
        {...props}
    />
)
