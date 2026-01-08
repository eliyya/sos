import { Temporal } from '@js-temporal/polyfill'
import { LABORATORY_TYPE, STATUS } from '@/prisma/generated/browser'
import { BeakerIcon, CalendarIcon, UsersIcon } from 'lucide-react'
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
import { getTranslations } from 'next-intl/server'

import { ConditionalLink } from './components/conditional-link'

export async function generateMetadata() {
    const t = await getTranslations('dashboard')
    return {
        title: `${t('panel_title')} | ${APP_NAME}`,
        description: t('panel_description'),
    }
}

export default async function AdminDashboardPage({
    params: { locale },
}: {
    params: { locale: 'es' }
}) {
    const t = await getTranslations('dashboard')
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
            title: t('laboratories'),
            value: labs.length,
            icon: BeakerIcon,
            description: t('active_laboratories'),
            href: app.$locale.dashboard.management.laboratories(locale),
            permissions: PERMISSIONS_FLAGS.MANAGE_LABS,
        },
        {
            title: t('reservations'),
            value: practices,
            icon: CalendarIcon,
            description: t('reservations_this_month'),
            href: app.$locale.schedule.null(locale),
            permissions: PERMISSIONS_FLAGS.CAN_LOGIN,
        },
        {
            title: t('visits'),
            value: visits.length,
            icon: CalendarIcon,
            description: t('visits_this_month'),
            href: app.$locale.dashboard(locale),
            permissions: PERMISSIONS_FLAGS.CAN_LOGIN,
        },
        {
            title: t('users'),
            value: users,
            icon: UsersIcon,
            description: t('registered_users'),
            href: app.$locale.dashboard.management.users(locale),
            permissions: PERMISSIONS_FLAGS.MANAGE_USERS,
        },
    ]

    return (
        <main className='flex flex-1 flex-col gap-4 p-8'>
            <DashboardHeader
                heading={t('admin_panel')}
                text={t('admin_description')}
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
                    {t('computer_centers')}
                </h2>
                <div className='grid gap-4 md:grid-cols-2'>
                    {ccs.map(CC => (
                        <ConditionalLink
                            key={CC.id}
                            href={app.$locale.dashboard.cc.$id(locale, CC.id)}
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
                                            {t('visits_today')}
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
