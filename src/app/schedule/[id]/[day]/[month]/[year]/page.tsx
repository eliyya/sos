import { LABORATORY_TYPE, STATUS } from '@/prisma/generated/browser'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import {
    PermissionsBitField,
    PermissionsFlags,
} from '@/bitfields/PermissionsBitField'
import { auth } from '@/lib/auth'
import { db } from '@/prisma/db'
import ScheduleBody from './components/ScheduleBody'
import { ScheduleHeader } from './components/ScheduleHeader'

export const metadata: Metadata = {
    title: 'Horario | Lab Reservation System',
    description: 'Horario semanal de reservas de laboratorio',
}

interface SchedulePageProps {
    params: Promise<{
        id: string
        day: string
        month: string
        year: string
    }>
}
export default async function SchedulePage({ params }: SchedulePageProps) {
    const { id } = await params

    const session = await auth.api.getSession({
        headers: await headers(),
    })
    const permissions = new PermissionsBitField(
        BigInt(session?.user.permissions ?? 0n),
    )
    // TODO: cambiar a MANAGE_LABS
    const isAdmin = !!session && permissions.has(PermissionsFlags.MANAGE_LABS)

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
            <ScheduleHeader permissions={permissions} lab_id={id} labs={labs} />
            <ScheduleBody
                user={user?.[0] ?? null}
                lab_id={id}
                labs={labs}
                isAdmin={isAdmin}
                users={others}
            />
        </div>
    )
}
