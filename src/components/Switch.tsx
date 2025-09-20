'use client'

import { Root, Thumb } from '@radix-ui/react-switch'
import { ComponentProps, useId } from 'react'
import { cn } from '@/lib/utils'

interface SwitchProps extends ComponentProps<typeof Root> {
    label: string
}
export default function LabeledSwitch({ label, id, ...props }: SwitchProps) {
    const rid = useId()
    return (
        <div className='pointer-cursor flex items-center gap-2'>
            <label htmlFor={id ?? rid} className='text-sm font-medium'>
                {label}
            </label>
            <Root
                {...props}
                id={id ?? rid}
                className='relative h-6 w-10 rounded-full bg-gray-300 transition-colors data-[state=checked]:bg-blue-500'
            >
                <Thumb className='ponter-cursor block h-4 w-4 translate-x-1 transform rounded-full bg-white shadow-md transition-transform data-[state=checked]:translate-x-5' />
            </Root>
        </div>
    )
}

export function Switch({ id, ...props }: ComponentProps<typeof Root>) {
    const rid = useId()
    return (
        <Root
            {...props}
            id={id ?? rid}
            className={cn(
                'pointer-cursor relative h-6 w-10 rounded-full bg-gray-300 transition-colors',
                'data-[state=checked]:bg-blue-500',
                'disabled:opacity-50',
            )}
        >
            <Thumb className='ponter-cursor block h-4 w-4 translate-x-1 transform rounded-full bg-white shadow-md transition-transform data-[state=checked]:translate-x-5' />
        </Root>
    )
}
