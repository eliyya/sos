import { Content, Trigger, List, Root } from '@radix-ui/react-tabs'
import { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const Tabs = Root

export const TabsList = ({
    className,
    ...props
}: ComponentProps<typeof List>) => (
    <List
        {...props}
        className={cn(
            'bg-muted text-muted-foreground inline-flex h-10 items-center justify-center rounded-md p-1',
            className,
        )}
    />
)

export const TabsTrigger = ({
    className,
    ...props
}: ComponentProps<typeof Trigger>) => (
    <Trigger
        {...props}
        className={cn(
            'ring-offset-background inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all',
            // focus-visible:
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            // data-[state=active]:
            'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
            // disabled:
            'disabled:pointer-events-none disabled:opacity-50',
            className,
        )}
    />
)

export const TabsContent = ({
    className,
    ...props
}: ComponentProps<typeof Content>) => (
    <Content
        className={cn(
            'ring-offset-background',
            // focus-visible:
            'focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            className,
        )}
        {...props}
    />
)
