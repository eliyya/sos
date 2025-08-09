import { Metadata } from 'next'
import { Calendar } from './components/Calendar'
import { db } from '@/prisma/db'
import { notFound } from 'next/navigation'
import { LABORATORY_TYPE, STATUS } from '@prisma/client'
import { CreateDialog } from './components/CreateDialog'
import { getPaylodadUser } from '@/actions/middleware'
import { RoleBitField, RoleFlags } from '@/bitfields/RoleBitField'
import { ScheduleHeader } from './components/ScheduleHeader'
import { Temporal } from '@js-temporal/polyfill'
import { InfoDialog } from './components/InfoDialog/InfoDialog'
import { SearchInput } from './components/SearchInput'

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

    const user = await getPaylodadUser()
    const userRoles = new RoleBitField(BigInt(user?.role ?? 0n))
    const isAdmin = !!user && userRoles.has(RoleFlags.Admin)

    let users: { id: string; name: string }[] = []

    if (isAdmin)
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
            <ScheduleHeader user={user} lab_id={id} labs={labs} />
            <main className='container mx-auto px-4 py-8'>
                <div className='flex items-center justify-between'>
                    <h1 className='mb-8 text-3xl font-bold'>Horario Semanal</h1>
                    <SearchInput />
                </div>
                <Calendar
                    userId={user?.sub ?? ''}
                    lab={lab}
                    isAdmin={isAdmin}
                />
                <CreateDialog
                    isAdmin={isAdmin}
                    lab={lab}
                    disabled={!user}
                    closeHour={lab.close_hour}
                    openHour={lab.open_hour}
                    user={user}
                    users={users}
                />
                <InfoDialog user={user} lab={lab} isAdmin={isAdmin} />
            </main>
        </div>
    )
}
