import { db } from '@/prisma/db'
import { DashboardHeader } from '@/app/dashboard/components/DashboardHeader'
import MonthReportOfPractices from './components/MonthReportOfPractices'
import { SelectLaboratory } from './components/SelectLaboratory'
import { LABORATORY_TYPE, STATUS } from '@prisma/client'

interface MonthReportOfPracticesProps {
    params: Promise<{
        lab_id: string
    }>
}
export default async function ReportsPage({
    params,
}: MonthReportOfPracticesProps) {
    const { lab_id } = await params
    const now = new Date()

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const practices = db.practice.findMany({
        where: {
            starts_at: { gte: monthStart },
            ends_at: { lte: monthEnd },
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
                    selectedMonth={now.getMonth() + 1}
                    selectedYear={now.getFullYear()}
                    data={practices}
                />
            </section>
        </div>
    )
}
