'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    BeakerIcon,
    CalendarIcon,
    LayoutDashboardIcon,
    UsersIcon,
    Settings2Icon,
    LogOutIcon,
} from 'lucide-react'
import app from '@eliyya/type-routes'
import { ComponentType } from 'react'

const adminNavItems = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboardIcon,
    },
    {
        title: 'Laboratorios',
        href: '/admin/labs',
        icon: BeakerIcon,
    },
    {
        title: 'Reservas',
        href: '/admin/reservations',
        icon: CalendarIcon,
    },
    {
        title: 'Usuarios',
        href: '/admin/users',
        icon: UsersIcon,
    },
]

const teacherNavItems: {
    title: string
    href: string
    icon: ComponentType<{ className: string }>
}[] = [
    {
        title: 'Dashboard',
        href: app.dashboard(),
        icon: LayoutDashboardIcon,
    },
    {
        title: 'Gestion de Usuarios',
        href: app.dashboard.management.users(),
        icon: BeakerIcon,
    },
]

export function DashboardNav() {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')
    const items = isAdmin ? adminNavItems : teacherNavItems

    return (
        <nav className='bg-muted/50 min-h-screen w-64 border-r px-4 py-8'>
            <Link href={app.dashboard()}>
                <div className='mb-8 flex items-center gap-2 px-4'>
                    <BeakerIcon className='text-primary h-6 w-6' />
                    <span className='text-lg font-semibold'>SOS</span>
                </div>
            </Link>

            <div className='space-y-2'>
                {items.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'hover:bg-accent flex items-center gap-3 rounded-md px-4 py-2 text-sm',
                            pathname === item.href ?
                                'bg-accent text-accent-foreground font-medium'
                            :   'text-muted-foreground',
                        )}
                    >
                        <item.icon className='h-4 w-4' />
                        {item.title}
                    </Link>
                ))}

                <div className='mt-auto border-t pt-4'>
                    <Link
                        href='/settings'
                        className='text-muted-foreground hover:bg-accent flex items-center gap-3 rounded-md px-4 py-2 text-sm'
                    >
                        <Settings2Icon className='h-4 w-4' />
                        Configuración
                    </Link>
                    <Link
                        href={app.auth.logout()}
                        className='text-muted-foreground hover:bg-accent flex items-center gap-3 rounded-md px-4 py-2 text-sm'
                    >
                        <LogOutIcon className='h-4 w-4' />
                        Cerrar Sesión
                    </Link>
                </div>
            </div>
        </nav>
    )
}
