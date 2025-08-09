'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    BeakerIcon,
    LayoutDashboardIcon,
    UsersIcon,
    // Settings2Icon,
    LogOutIcon,
    BookMarkedIcon,
    SquareUserRoundIcon,
    CalendarCheckIcon,
    LucideIcon,
    HouseWifiIcon,
    ComputerIcon,
    GraduationCapIcon,
    FileDownIcon,
} from 'lucide-react'
import app from '@eliyya/type-routes'

const MLinks = app.dashboard.management
const teacherNavItems: {
    title: string
    href: string
    icon: LucideIcon
}[] = [
    {
        title: 'Dashboard',
        href: app.dashboard(),
        icon: LayoutDashboardIcon,
    },
    {
        title: 'Horario',
        href: '/schedule',
        icon: BeakerIcon,
    },
    {
        title: 'Gestion de Usuarios',
        href: MLinks.users(),
        icon: UsersIcon,
    },
    {
        title: 'Gestion de Materias',
        href: MLinks.subjects(),
        icon: BookMarkedIcon,
    },
    {
        title: 'Gestion de Carreras',
        href: MLinks.career(),
        icon: SquareUserRoundIcon,
    },
    {
        title: 'Gestion de Clases',
        href: MLinks.classes(),
        icon: CalendarCheckIcon,
    },
    {
        title: 'Gestion de Estudiantes',
        href: MLinks.students(),
        icon: GraduationCapIcon,
    },
    {
        title: 'Gestion de Maquinas',
        href: MLinks.machines(),
        icon: ComputerIcon,
    },
    {
        title: 'Gestion de Laboratorios',
        href: MLinks.laboratories(),
        icon: HouseWifiIcon,
    },
    {
        title: 'Reportes de Laboratorio',
        href: '/dashboard/reports/lab',
        icon: LayoutDashboardIcon,
    },
    {
        title: 'Reportes de CC',
        href: '/dashboard/reports/cc',
        icon: LayoutDashboardIcon,
    },
    {
        title: 'Consultar Datos',
        href: app.dashboard.reports.query(),
        icon: LayoutDashboardIcon,
    },
    {
        title: 'Exportar Datos',
        href: app.dashboard.export(),
        icon: FileDownIcon,
    },
]

interface DashboardNavProps {
    className?: string
}

export function DashboardNav({ className }: DashboardNavProps) {
    const pathname = usePathname()
    const items = teacherNavItems

    return (
        <nav
            className={cn(
                'bg-muted/50 min-h-screen w-64 border-r px-4 py-8',
                className,
            )}
        >
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
                    {/* <Link
                        href='/settings'
                        className='text-muted-foreground hover:bg-accent flex items-center gap-3 rounded-md px-4 py-2 text-sm'
                    >
                        <Settings2Icon className='h-4 w-4' />
                        Configuración
                    </Link> */}
                    <Link
                        href={app.auth.logout()}
                        prefetch={false}
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
