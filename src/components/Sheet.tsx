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
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { HTMLAttributes, ComponentProps } from 'react'

import { cn } from '@/lib/utils'


export const Sheet = Root

export const SheetTrigger = Trigger

export const SheetClose = Close

export const SheetPortal = Portal

export const SheetOverlay = ({
    className,
    ...props
}: ComponentProps<typeof Overlay>) => (
    <Overlay
        className={cn(
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80',
            className,
        )}
        {...props}
    />
)

const sheetVariants = cva(
    'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
    {
        variants: {
            side: {
                top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
                bottom: 'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
                left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
                right: 'inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
            },
        },
        defaultVariants: {
            side: 'right',
        },
    },
)

export const SheetContent = ({
    side = 'right',
    className,
    children,
    ...props
}: ComponentProps<typeof Content> & VariantProps<typeof sheetVariants>) => (
    <SheetPortal>
        <SheetOverlay />
        <Content className={cn(sheetVariants({ side }), className)} {...props}>
            {children}
            <Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </Close>
        </Content>
    </SheetPortal>
)

export const SheetHeader = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex flex-col space-y-2 text-center',
            'sm:text-left',
            className,
        )}
        {...props}
    />
)

export const SheetFooter = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
            className,
        )}
        {...props}
    />
)

export const SheetTitle = ({
    className,
    ...props
}: ComponentProps<typeof Title>) => (
    <Title
        className={cn('text-foreground text-lg font-semibold', className)}
        {...props}
    />
)

export const SheetDescription = ({
    className,
    ...props
}: ComponentProps<typeof Description>) => (
    <Description
        className={cn('text-muted-foreground text-sm', className)}
        {...props}
    />
)
