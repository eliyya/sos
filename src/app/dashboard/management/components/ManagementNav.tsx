'use client'

import app from '@eliyya/type-routes'
import {
    BookMarkedIcon,
    CalendarCheckIcon,
    ComputerIcon,
    GraduationCapIcon,
    HouseWifiIcon,
    LucideIcon,
    ShieldCheckIcon,
    SquareUserRoundIcon,
    UsersIcon,
} from 'lucide-react'
import { ManagementNavLink } from './ManagementNavLink'

const mLinks = app.dashboard.management

type MLinks = {
    [K in keyof typeof mLinks]: (typeof mLinks)[K] extends { (): infer R } ?
        () => R
    :   never
}
const links: {
    title: string
    href: ReturnType<MLinks[keyof MLinks]>
    icon: LucideIcon
}[] = [
    {
        title: 'Laboratorios',
        href: mLinks.laboratories(),
        icon: HouseWifiIcon,
    },
    {
        title: 'Usuarios',
        href: mLinks.users(),
        icon: UsersIcon,
    },
    {
        title: 'Roles',
        href: mLinks.roles(),
        icon: ShieldCheckIcon,
    },
    {
        title: 'Materias',
        href: mLinks.subjects(),
        icon: BookMarkedIcon,
    },
    {
        title: 'Carreras',
        href: mLinks.career(),
        icon: SquareUserRoundIcon,
    },
    {
        title: 'Clases',
        href: mLinks.classes(),
        icon: CalendarCheckIcon,
    },
    {
        title: 'Estudiantes',
        href: mLinks.students(),
        icon: GraduationCapIcon,
    },
    {
        title: 'Maquinas',
        href: mLinks.machines(),
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
