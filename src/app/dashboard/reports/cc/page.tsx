import { db } from '@/prisma/db'
import { DashboardHeader } from '../../components/DashboardHeader'
import { MonthReportOfVisits } from './components/MonthReportOfVisits'

export default async function ReportsPage() {
    const now = new Date()

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const visits = db.visit.findMany({
        where: {
            created_at: { gte: monthStart, lte: monthEnd },
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

    return (
        <div className='container mx-auto px-4 py-6'>
            <DashboardHeader
                heading='Reportes de uso del centro de computo'
                text=''
            />

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
