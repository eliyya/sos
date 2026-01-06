import { Temporal } from '@js-temporal/polyfill'
import { LABORATORY_TYPE, STATUS } from '@/prisma/generated/browser'
import { BeakerIcon, CalendarIcon, UsersIcon } from 'lucide-react'
import { Metadata } from 'next'
import { DashboardHeader } from '@/app/[locale]/dashboard/components/DashboardHeader'
import { Card, CardContent } from '@/components/ui/card'
import { APP_NAME } from '@/constants/client'
import { db } from '@/prisma/db'
import app from '@eliyya/type-routes'
import { auth } from '@/lib/auth'
import {
    PERMISSIONS_FLAGS,
    PermissionsBitField,
} from '@/bitfields/PermissionsBitField'
import { headers } from 'next/headers'

import { ConditionalLink } from './components/conditional-link'

export const metadata: Metadata = {
    title: 'Panel de Administrador | ' + APP_NAME,
    description: 'gestión de laboratorios y usuarios',
}

export default async function AdminDashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    const permissions = new PermissionsBitField(session?.user.permissions ?? '')
    const ccs = await db.laboratory.findMany({
        where: {
            type: LABORATORY_TYPE.COMPUTER_CENTER,
            status: STATUS.ACTIVE,
        },
    })
    const labs = await db.laboratory.findMany({
        where: {
            type: LABORATORY_TYPE.LABORATORY,
            status: STATUS.ACTIVE,
        },
    })
    const now = Temporal.Now.zonedDateTimeISO('America/Monterrey')
    const today = now.subtract({
        hours: now.hour,
        minutes: now.minute,
        seconds: now.second,
        milliseconds: now.millisecond,
        microseconds: now.microsecond,
        nanoseconds: now.nanosecond,
    })
    const monthStart = now.subtract({ days: now.day })
    const monthEnd = monthStart.add({ months: 1 }).subtract({ seconds: 1 })

    const practices = await db.reservation.count({
        where: {
            created_at: {
                gte: new Date(monthStart.epochMilliseconds),
                lte: new Date(monthEnd.epochMilliseconds),
            },
            class: { isNot: null },
        },
    })
    const visits = await db.visit.findMany({
        where: {
            created_at: {
                gte: new Date(monthStart.epochMilliseconds),
                lte: new Date(monthEnd.epochMilliseconds),
            },
            student: {
                career: {
                    is: { id: { not: undefined } },
                },
            },
        },
        select: {
            laboratory_id: true,
            created_at: true,
        },
    })
    const users = await db.user.count()
    const stats = [
        {
            title: 'Laboratorios',
            value: labs.length,
            icon: BeakerIcon,
            description: 'Laboratorios activos',
            href: app.$locale.dashboard.management.laboratories('es'),
            permissions: PERMISSIONS_FLAGS.MANAGE_LABS,
        },
        {
            title: 'Reservas',
            value: practices,
            icon: CalendarIcon,
            description: 'Reservas este mes',
            href: app.$locale.schedule.null('es'),
            permissions: PERMISSIONS_FLAGS.CAN_LOGIN,
        },
        {
            title: 'Visitas',
            value: visits.length,
            icon: CalendarIcon,
            description: 'Visitas este mes',
            href: app.$locale.dashboard('es'),
            permissions: PERMISSIONS_FLAGS.CAN_LOGIN,
        },
        {
            title: 'Usuarios',
            value: users,
            icon: UsersIcon,
            description: 'Usuarios registrados',
            href: app.$locale.dashboard.management.users('es'),
            permissions: PERMISSIONS_FLAGS.MANAGE_USERS,
        },
    ]

    return (
        <main className='flex flex-1 flex-col gap-4 p-8'>
            <DashboardHeader
                heading='Panel de Administracion'
                text='Gestiona laboratorio, reservas y usuarios del sistemas.'
            />
            <div className='grid gap-8'>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    {stats.map(stat => (
                        <ConditionalLink
                            key={stat.title}
                            href={stat.href}
                            condition={permissions.has(stat.permissions)}
                        >
                            <Card className='p-6'>
                                <CardContent>
                                    <div className='flex items-center gap-4'>
                                        <div className='bg-primary/10 rounded-full p-3'>
                                            <stat.icon className='text-primary h-6 w-6' />
                                        </div>
                                        <div>
                                            <p className='text-muted-foreground text-sm font-medium'>
                                                {stat.title}
                                            </p>
                                            <h3 className='text-2xl font-bold'>
                                                {stat.value}
                                            </h3>
                                            <p className='text-muted-foreground mt-1 text-xs'>
                                                {stat.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </ConditionalLink>
                    ))}
                </div>
                <h2 className='text-2xl font-bold tracking-tight'>
                    Centros de Computo
                </h2>
                <div className='grid gap-4 md:grid-cols-2'>
                    {ccs.map(CC => (
                        <ConditionalLink
                            key={CC.id}
                            href={app.$locale.dashboard.cc.$id('es', CC.id)}
                            condition={permissions.has(
                                PERMISSIONS_FLAGS.SESSION_CC,
                            )}
                        >
                            <Card className='p-6 transition-shadow hover:shadow-lg'>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-primary/10 rounded-full p-3'>
                                        <BeakerIcon className='text-primary h-6 w-6' />
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium'>
                                            {CC.name}
                                        </p>
                                        <h3 className='text-2xl font-bold'>
                                            {
                                                visits.filter(
                                                    visit =>
                                                        visit.laboratory_id ===
                                                            CC.id &&
                                                        visit.created_at.getTime() >=
                                                            today.epochMilliseconds,
                                                ).length
                                            }
                                        </h3>
                                        <p className='text-muted-foreground mt-1 text-xs'>
                                            Visitas hoy
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </ConditionalLink>
                    ))}
                </div>
            </div>
        </main>
    )
}
