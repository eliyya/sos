import { STATUS } from '@/prisma/generated/browser'
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/prisma/db'
import AnonimousScheduleBody from './components/anonimous/anonimous-schedule-body'
import LoggedScheduleBody from './components/logged/logged-schedule-body'

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

    const lab = await db.laboratory.findFirst({
        where: {
            id,
            status: STATUS.ACTIVE,
        },
    })
    if (!lab) notFound()

    if (!session) return <AnonimousScheduleBody lab_id={id} />

    return <LoggedScheduleBody lab_id={id} />
}
