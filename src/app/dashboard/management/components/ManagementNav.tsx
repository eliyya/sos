'use client'

import app from '@eliyya/type-routes'
import { ManagementNavLink } from './ManagementNavLink'
import {
    BookMarkedIcon,
    CalendarCheckIcon,
    ComputerIcon,
    GraduationCapIcon,
    HouseWifiIcon,
    LucideIcon,
    SquareUserRoundIcon,
    UsersIcon,
} from 'lucide-react'

const MLinks = app.dashboard.management

const links: {
    title: string
    href: ReturnType<(typeof MLinks)[keyof typeof MLinks]>
    icon: LucideIcon
}[] = [
    {
        title: 'Laboratorios',
        href: MLinks.laboratories(),
        icon: HouseWifiIcon,
    },
    {
        title: 'Usuarios',
        href: MLinks.users(),
        icon: UsersIcon,
    },
    {
        title: 'Materias',
        href: MLinks.subjects(),
        icon: BookMarkedIcon,
    },
    {
        title: 'Carreras',
        href: MLinks.career(),
        icon: SquareUserRoundIcon,
    },
    {
        title: 'Clases',
        href: MLinks.classes(),
        icon: CalendarCheckIcon,
    },
    {
        title: 'Estudiantes',
        href: MLinks.students(),
        icon: GraduationCapIcon,
    },
    {
        title: 'Maquinas',
        href: MLinks.machines(),
        icon: ComputerIcon,
    },
]

export function ManagementNav() {
    return (
        <nav className='flex flex-nowrap items-center justify-center gap-4 overflow-x-auto border-b p-4'>
            {links.map(link => (
                <ManagementNavLink
                    key={link.href}
                    href={link.href}
                    label={link.title}
                    icon={link.icon}
                />
            ))}
        </nav>
    )
}
