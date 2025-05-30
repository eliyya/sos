import { db } from '@/prisma/db'
import { DashboardHeader } from '@/app/dashboard/components/DashboardHeader'
import MonthReportOfPractices from './components/MonthReportOfPractices'
import { SelectLaboratory } from './components/SelectLaboratory'
import { LABORATORY_TYPE, STATUS } from '@prisma/client'
import { Temporal } from '@js-temporal/polyfill'

interface MonthReportOfPracticesProps {
    params: Promise<{
        lab_id: string
        month: string
        year: string
    }>
}
export default async function ReportsPage({
    params,
}: MonthReportOfPracticesProps) {
    const { lab_id, month, year } = await params
    const monthStart = Temporal.PlainDate.from({
        year: parseInt(year),
        month: parseInt(month),
        day: 1,
    }).toZonedDateTime('America/Monterrey')
    const monthEnd = monthStart.add({ months: 1 }).subtract({ seconds: 1 })

    const practices = db.practice.findMany({
        where: {
            created_at: {
                gte: new Date(monthStart.epochMilliseconds),
                lte: new Date(monthEnd.epochMilliseconds),
            },
            class: { isNot: null },
            laboratory_id: lab_id,
        },
        select: {
            starts_at: true,
            ends_at: true,
            class: {
                select: {
                    career: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
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
        },
    })

    return (
        <div className='container mx-auto px-4 py-6'>
            <div className='flex max-w-full items-center justify-between'>
                <DashboardHeader heading='Reportes' text='' />

                <SelectLaboratory labs={labs} lab_id={lab_id} />
            </div>

            <section className='mt-6'>
                <MonthReportOfPractices
                    selectedMonth={monthStart.toLocaleString('es-MX', {
                        month: 'long',
                    })}
                    selectedYear={parseInt(year)}
                    data={practices}
                />
            </section>
        </div>
    )
}
