import { LABORATORY_TYPE, STATUS } from '@/prisma/generated/browser'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import {
    PermissionsBitField,
    ADMIN_BITS,
} from '@/bitfields/PermissionsBitField'
import { auth } from '@/lib/auth'
import { db } from '@/prisma/db'
import ScheduleBody from './components/ScheduleBody'
import { ScheduleHeader } from './components/ScheduleHeader'
import { SearchInput } from './components/SearchInput'
import AnonimousScheduleBody from './components/anonimous/anonimous-schedule-body'

export const metadata: Metadata = {
    title: 'Horario | Lab Reservation System',
    description: 'Horario semanal de reservas de laboratorio',
}

export default async function SchedulePage({
    params,
}: PageProps<'/[locale]/schedule/[id]/[day]/[month]/[year]'>) {
    const { id } = await params

    const session = await auth.api.getSession({
        headers: await headers(),
    })
    const isAdmin =
        !!session &&
        new PermissionsBitField(BigInt(session.user.permissions)).any(
            ADMIN_BITS,
        )

    let users: { id: string; name: string }[] = []

    users = await db.user.findMany({
        where: {
            status: STATUS.ACTIVE,
        },
        select: {
            id: true,
            name: true,
        },
    })
    const { user, others = [] } = Object.groupBy(users, u =>
        u.id === session?.user.id ? 'user' : 'others',
    )

    const labs = await db.laboratory.findMany({
        where: {
            type: LABORATORY_TYPE.LABORATORY,
            status: STATUS.ACTIVE,
        },
        select: {
            id: true,
            name: true,
            open_hour: true,
            close_hour: true,
        },
    })
    const lab = labs.find(l => l.id === id)
    if (!lab) notFound()

    return (
        <div className='bg-background min-h-screen'>
            <ScheduleHeader labs={labs} />
            <main className='container mx-auto px-4 py-8'>
                <div className='flex items-center justify-between'>
                    <h1 className='mb-8 text-3xl font-bold'>Horario Semanal</h1>
                    <SearchInput />
                </div>
                {/* Schedule Body */}
                <AnonimousScheduleBody lab_id={id} />
            </main>
        </div>
    )
}
