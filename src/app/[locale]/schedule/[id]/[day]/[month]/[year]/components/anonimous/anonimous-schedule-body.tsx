import { db } from '@/prisma/db'
import { Calendar } from './calendar'
import { notFound } from 'next/navigation'
import { InfoDialog } from './InfoDialog'

interface AnonimousScheduleBodyProps {
    lab_id: string
}
export default async function AnonimousScheduleBody({
    lab_id,
}: AnonimousScheduleBodyProps) {
    const lab = await db.laboratory.findFirst({ where: { id: lab_id } })
    if (!lab) notFound()

    return (
        <>
            <Calendar lab={lab} />
            <InfoDialog />
        </>
    )
}
