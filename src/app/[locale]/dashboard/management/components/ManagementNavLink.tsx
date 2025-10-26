'use client'

import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { memo } from 'react'
import { cn } from '@/lib/utils'

export const ManagementNavLink = memo(function ManagementNavLink({
    href,
    label,
    icon: Icon,
}: {
    href: string
    label: string
    icon: LucideIcon
}) {
    const pathname = usePathname().replace(/\/$/, '')

    const active = pathname === href.replace(/\/$/, '')

    return (
        <Link
            href={href}
            className={cn('flex items-center gap-2 text-gray-500', {
                'text-foreground border-primary border-b-2 font-bold': active,
            })}
        >
            <Icon className='h-4 w-4' />
            {label}
        </Link>
    )
})
