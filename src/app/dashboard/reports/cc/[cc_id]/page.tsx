import { db } from '@/prisma/db'
import { DashboardHeader } from '@/app/dashboard/components/DashboardHeader'
import { MonthReportOfVisits } from './components/MonthReportOfVisits'
import { LABORATORY_TYPE, STATUS } from '@prisma/client'
import { SelectLaboratory } from './components/SelectLaboratory'

interface MonthReportOfVisitsProps {
    params: Promise<{
        cc_id: string
    }>
}
export default async function ReportsPage({
    params,
}: MonthReportOfVisitsProps) {
    const { cc_id } = await params
    const now = new Date()

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const visits = db.visit.findMany({
        where: {
            created_at: { gte: monthStart, lte: monthEnd },
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

    return (
        <div className='container mx-auto px-4 py-6'>
            <div className='flex max-w-full items-center justify-between'>
                <DashboardHeader
                    heading='Reportes de uso del centro de computo'
                    text=''
                />
                <SelectLaboratory labs={labs} cc_id={cc_id} />
            </div>

            <section className='mt-6'>
                <MonthReportOfVisits
                    selectedMonth={now.getMonth() + 1}
                    selectedYear={now.getFullYear()}
                    data={visits}
                />
            </section>
        </div>
    )
}
