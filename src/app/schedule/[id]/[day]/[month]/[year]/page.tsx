import { Metadata } from 'next'
import { Calendar } from './components/Calendar'
import { db } from '@/prisma/db'
import { notFound } from 'next/navigation'
import { minutesToTime } from '@/lib/utils'
import { LABORATORY_TYPE, STATUS } from '@prisma/client'
import { EventSourceInput } from '@fullcalendar/core/index.js'
import { CreateDialog } from './components/CreateDialog'
import { getPaylodadUser } from '@/actions/middleware'
import { RoleBitField, RoleFlags } from '@/bitfields/RoleBitField'
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
    const { id, day, month, year } = await params
    const user = await getPaylodadUser()
    let users: { id: string; name: string }[] = []

    if (user && new RoleBitField(BigInt(user.role)).has(RoleFlags.Admin))
        users = await db.user.findMany({
            where: {
                status: STATUS.ACTIVE,
                role: {
                    in: RoleBitField.getCombinationsOf(RoleFlags.Teacher),
                },
                NOT: { id: user.sub },
            },
            select: {
                id: true,
                name: true,
            },
        })
    /**
     * Current date format YYYY-MM-DD
     */
    const todayString: `${string}-${string}-${string}` = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

    const lab = await db.laboratory.findFirst({
        where: {
            id,
            type: LABORATORY_TYPE.LABORATORY,
            status: STATUS.ACTIVE,
        },
        select: {
            id: true,
            name: true,
            open_hour: true,
            close_hour: true,
            practices: {
                where: {
                    starts_at: {
                        gte: new Date(`${todayString}T00:00:00`),
                        lte: new Date(`${todayString}T23:59:59`),
                    },
                },
            },
        },
    })
    if (!lab) notFound()
    const events: EventSourceInput = lab.practices.map(practice => ({
        title: practice.name,
        start: practice.starts_at,
        end: practice.ends_at,
    }))
    const labs = await db.laboratory.findMany({
        where: {
            type: LABORATORY_TYPE.LABORATORY,
            status: STATUS.ACTIVE,
        },
        select: {
            id: true,
            name: true,
        },
    })

    return (
        <div className='bg-background min-h-screen'>
            <ScheduleHeader
                isAdmin={
                    !!user &&
                    new RoleBitField(BigInt(user.role)).has(RoleFlags.Admin)
                }
                day={day}
                month={month}
                year={year}
                lab_id={id}
                labs={labs}
            />
            <main className='container mx-auto px-4 py-8'>
                <h1 className='mb-8 text-3xl font-bold'>Horario Semanal</h1>
                <Calendar
                    events={events}
                    id={id}
                    day={new Date(`${year}-${month}-${day}`)}
                    startHour={minutesToTime(lab.open_hour) + ':00'}
                    endHour={minutesToTime(lab.close_hour) + ':00'}
                />
                <CreateDialog
                    isAdmin={
                        !!user &&
                        new RoleBitField(BigInt(user.role)).has(RoleFlags.Admin)
                    }
                    lab_name={lab.name}
                    events={events}
                    disabled={!user}
                    endHour={lab.close_hour}
                    startHour={lab.open_hour}
                    user={{ id: user?.sub ?? '', name: user?.name ?? '' }}
                    users={users}
                />
            </main>
        </div>
    )
}
