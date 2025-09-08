'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    BeakerIcon,
    LayoutDashboardIcon,
    UsersIcon,
    LogOutIcon,
    BookMarkedIcon,
    SquareUserRoundIcon,
    CalendarCheckIcon,
    LucideIcon,
    HouseWifiIcon,
    ComputerIcon,
    GraduationCapIcon,
    FileDownIcon,
    FileSearchIcon,
    MicroscopeIcon,
    PcCaseIcon,
} from 'lucide-react'
import { Accordion, AccordionSection } from '@/components/Accordion'
import app from '@eliyya/type-routes'
import { APP_NAME } from '@/constants/client'

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
]

const managementNavItems: {
    title: string
    href: ReturnType<(typeof MLinks)[keyof typeof MLinks]>
    icon: LucideIcon
}[] = [
    {
        title: 'De Laboratorios',
        href: MLinks.laboratories(),
        icon: HouseWifiIcon,
    },
    {
        title: 'De Usuarios',
        href: MLinks.users(),
        icon: UsersIcon,
    },
    {
        title: 'De Materias',
        href: MLinks.subjects(),
        icon: BookMarkedIcon,
    },
    {
        title: 'De Carreras',
        href: MLinks.career(),
        icon: SquareUserRoundIcon,
    },
    {
        title: 'De Clases',
        href: MLinks.classes(),
        icon: CalendarCheckIcon,
    },
    {
        title: 'De Estudiantes',
        href: MLinks.students(),
        icon: GraduationCapIcon,
    },
    {
        title: 'De Maquinas',
        href: MLinks.machines(),
        icon: ComputerIcon,
    },
]

const reportNavItems: {
    title: string
    href: string
    icon: LucideIcon
}[] = [
    {
        title: 'De Laboratorio',
        href: '/dashboard/reports/lab',
        icon: MicroscopeIcon,
    },
    {
        title: 'De CC',
        href: '/dashboard/reports/cc',
        icon: PcCaseIcon,
    },
    {
        title: 'Consultar Datos',
        href: app.dashboard.reports.query(),
        icon: FileSearchIcon,
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
                    <span className='text-lg font-semibold'>{APP_NAME}</span>
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

                <Accordion type='single' collapsible>
                    <AccordionSection value='item-1' name='Gestión'>
                        {managementNavItems.map(item => (
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
                    </AccordionSection>
                    <AccordionSection value='item-2' name='Reportes'>
                        {reportNavItems.map(item => (
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
                    </AccordionSection>
                </Accordion>

                <div className='mt-auto border-t pt-4'>
                    {/*  <Link
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
