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
import {
    PermissionsBitField,
    PERMISSIONS_FLAGS,
    ManagedFlags,
} from '@/bitfields/PermissionsBitField'
import { authClient } from '@/lib/auth-client'

const mLinks = app.$locale.dashboard.management

const links: {
    title:
        | 'Laboratorios'
        | 'Usuarios'
        | 'Roles'
        | 'Materias'
        | 'Carreras'
        | 'Clases'
        | 'Estudiantes'
        | 'Maquinas'
        | 'Software'
    href: string
    icon: LucideIcon
    permission: ManagedFlags
}[] = [
    {
        title: 'Laboratorios',
        href: mLinks.laboratories('es'),
        icon: HouseWifiIcon,
        permission: PERMISSIONS_FLAGS.MANAGE_LABS,
    },
    {
        title: 'Usuarios',
        href: mLinks.users('es'),
        icon: UsersIcon,
        permission: PERMISSIONS_FLAGS.MANAGE_USERS,
    },
    {
        title: 'Roles',
        href: mLinks.roles('es'),
        icon: ShieldCheckIcon,
        permission: PERMISSIONS_FLAGS.MANAGE_ROLES,
    },
    {
        title: 'Materias',
        href: mLinks.subjects('es'),
        icon: BookMarkedIcon,
        permission: PERMISSIONS_FLAGS.MANAGE_SUBJECTS,
    },
    {
        title: 'Carreras',
        href: mLinks.careers('es'),
        icon: SquareUserRoundIcon,
        permission: PERMISSIONS_FLAGS.MANAGE_CAREERS,
    },
    {
        title: 'Clases',
        href: mLinks.classes('es'),
        icon: CalendarCheckIcon,
        permission: PERMISSIONS_FLAGS.MANAGE_CLASSES,
    },
    {
        title: 'Estudiantes',
        href: mLinks.students('es'),
        icon: GraduationCapIcon,
        permission: PERMISSIONS_FLAGS.MANAGE_STUDENTS,
    },
    {
        title: 'Maquinas',
        href: mLinks.machines('es'),
        icon: ComputerIcon,
        permission: PERMISSIONS_FLAGS.MANAGE_MACHINES,
    },
    // {
    //     title: 'Software',
    //     href: mLinks.software('es'),
    //     icon: ComputerIcon,
    //     permission: PERMISSIONS_FLAGS.MANAGE_SOFTWARE,
    // },
] as const

export function ManagementNav() {
    const { data: session } = authClient.useSession()
    const permissions =
        session ?
            new PermissionsBitField(session.user.permissions)
        :   new PermissionsBitField()

    return (
        <nav className='flex flex-nowrap items-center justify-center gap-4 overflow-x-auto border-b p-4'>
            {links
                .filter(link => permissions.has(link.permission))
                .map(link => (
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
