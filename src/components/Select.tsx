'use client'

import {
    ScrollDownButton,
    ScrollUpButton,
    ItemIndicator,
    Separator,
    Viewport,
    ItemText,
    Trigger,
    Content,
    Portal,
    Group,
    Label,
    Value,
    Icon,
    Root,
    Item,
} from '@radix-ui/react-select'
import {
    ComponentPropsWithoutRef,
    ComponentProps,
    ComponentRef,
    forwardRef,
} from 'react'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Select = Root

export const SelectGroup = Group

export const SelectValue = Value

export const SelectTrigger = ({
    className,
    children,
    ...props
}: ComponentProps<typeof Trigger>) => (
    <Trigger
        className={cn(
            'border-input bg-background ring-offset-background flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm',
            // [&>span]
            '[&>span]:line-clamp-1',
            // placeholder:
            'placeholder:text-muted-foreground',
            // disabled:
            'disabled:cursor-not-allowed disabled:opacity-50',
            // focus:
            'focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none',
            className,
        )}
        {...props}
    >
        {children}
        <Icon asChild>
            <ChevronDown className="h-4 w-4 opacity-50" />
        </Icon>
    </Trigger>
)

export const SelectScrollUpButton = ({
    className,
    ...props
}: ComponentProps<typeof ScrollUpButton>) => (
    <ScrollUpButton
        className={cn(
            'flex cursor-default items-center justify-center py-1',
            className,
        )}
        {...props}
    >
        <ChevronUp className="h-4 w-4" />
    </ScrollUpButton>
)

export const SelectScrollDownButton = ({
    className,
    ...props
}: ComponentProps<typeof ScrollDownButton>) => (
    <ScrollDownButton
        className={cn(
            'flex cursor-default items-center justify-center py-1',
            className,
        )}
        {...props}
    >
        <ChevronDown className="h-4 w-4" />
    </ScrollDownButton>
)

export const SelectContent = forwardRef<
    ComponentRef<typeof Content>,
    ComponentPropsWithoutRef<typeof Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
    <Portal>
        <Content
            ref={ref}
            className={cn(
                'bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md',
                // data-[state=open]:
                'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                // data-[state=closed]:
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                // data-[side=bottom]:
                'data-[side=bottom]:slide-in-from-top-2',
                // data-[side=top]:
                'data-[side=top]:slide-in-from-bottom-2',
                //data-[side=right]:
                'data-[side=right]:slide-in-from-left-2',
                // data-[side=left]:
                'data-[side=left]:slide-in-from-right-2',
                {
                    'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1':
                        position === 'popper',
                },
                className,
            )}
            position={position}
            {...props}
        >
            <SelectScrollUpButton />
            <Viewport
                className={cn('p-1', {
                    'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]':
                        position === 'popper',
                })}
            >
                {children}
            </Viewport>
            <SelectScrollDownButton />
        </Content>
    </Portal>
))
SelectContent.displayName = 'SelectContent'

export const SelectLabel = ({
    className,
    ...props
}: ComponentProps<typeof Label>) => (
    <Label
        className={cn('py-1.5 pr-2 pl-8 text-sm font-semibold', className)}
        {...props}
    />
)

export const SelectItem = ({
    className,
    children,
    ...props
}: ComponentProps<typeof Item>) => (
    <Item
        className={cn(
            'relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none',
            // focus:
            'focus:bg-accent focus:text-accent-foreground',
            // data-[disabled]:
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className,
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <ItemIndicator>
                <Check className="h-4 w-4" />
            </ItemIndicator>
        </span>

        <ItemText>{children}</ItemText>
    </Item>
)

export const SelectSeparator = ({
    className,
    ...props
}: ComponentProps<typeof Separator>) => (
    <Separator
        className={cn('bg-muted -mx-1 my-1 h-px', className)}
        {...props}
    />
)
