import { db } from '@/prisma/db'
import { Calendar } from './calendar'
import { notFound } from 'next/navigation'
import { InfoDialog } from './InfoDialog'
import { ReserveDialog } from './reserve-self-dialog'

interface LoggedScheduleBodyProps {
    lab_id: string
}
export default async function LoggedScheduleBody({
    lab_id,
}: LoggedScheduleBodyProps) {
    const lab = await db.laboratory.findFirst({ where: { id: lab_id } })
    if (!lab) notFound()

    return (
        <>
            <Calendar lab={lab} />
            <InfoDialog />
            <ReserveDialog laboratory_id={lab.id} />
        </>
    )
}
