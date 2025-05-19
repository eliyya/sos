import Link from 'next/link'
import { SelectLaboratory } from './SelectLaboratory'
import app from '@eliyya/type-routes'

interface ScheduleHeaderProps {
    labs: { id: string; name: string }[]
    lab_id: string
    day: string
    month: string
    year: string
    isAdmin?: boolean
}
export function ScheduleHeader({
    labs,
    lab_id,
    day,
    month,
    year,
    isAdmin = false,
}: ScheduleHeaderProps) {
    return (
        <div className='container mx-auto flex items-center justify-between p-2'>
            <div>
                <SelectLaboratory
                    day={day}
                    month={month}
                    year={year}
                    lab_id={lab_id}
                    labs={labs}
                />
            </div>
            <div className='flex items-center justify-end gap-4'>
                {isAdmin && <Link href={app.dashboard()}>Dashboard</Link>}
            </div>
        </div>
    )
}
