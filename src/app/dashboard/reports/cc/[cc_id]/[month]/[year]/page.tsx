import { Temporal } from '@js-temporal/polyfill'
import { LABORATORY_TYPE, STATUS } from '@prisma/client'
import { DashboardHeader } from '@/app/dashboard/components/DashboardHeader'
import { db } from '@/prisma/db'
import { ChangueDate } from './components/ChangueDate'
import { MonthReportOfVisits } from './components/MonthReportOfVisits'
import { SelectLaboratory } from './components/SelectLaboratory'



interface MonthReportOfVisitsProps {
    params: Promise<{
        cc_id: string
        month: string
        year: string
    }>
}
export default async function ReportsPage({
    params,
}: MonthReportOfVisitsProps) {
    const { cc_id, month, year } = await params

    const monthStart = Temporal.PlainDate.from({
        year: parseInt(year),
        month: parseInt(month),
        day: 1,
    }).toZonedDateTime('America/Monterrey')
    const monthEnd = monthStart.add({ months: 1 }).subtract({ seconds: 1 })

    const visits = db.visit.findMany({
        where: {
            created_at: {
                gte: new Date(monthStart.epochMilliseconds),
                lte: new Date(monthEnd.epochMilliseconds),
            },
            laboratory_id: cc_id,
            student: {
                career: {
                    is: { id: { not: undefined } },
                },
            },
        },
        select: {
            created_at: true,
            student: {
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
            type: LABORATORY_TYPE.COMPUTER_CENTER,
            status: STATUS.ACTIVE,
        },
        select: {
            id: true,
            name: true,
        },
    })
    const careers = await db.career.findMany({
        select: {
            name: true,
        },
    })

    return (
        <div className='container mx-auto px-4 py-6'>
            <div className='flex max-w-full items-center justify-between'>
                <DashboardHeader
                    heading='Reportes de uso del centro de computo'
                    text=''
                />
                <SelectLaboratory
                    month={month}
                    year={year}
                    labs={labs}
                    cc_id={cc_id}
                />
            </div>
            <div className='mt-6 flex items-center justify-end gap-2'>
                <ChangueDate lab_id={cc_id} />
            </div>
            <section className='mt-6'>
                <MonthReportOfVisits
                    selectedMonth={monthStart.toLocaleString('es-MX', {
                        month: 'long',
                    })}
                    selectedYear={parseInt(year)}
                    data={visits}
                    carrers={careers.map(c => c.name)}
                />
            </section>
        </div>
    )
}
