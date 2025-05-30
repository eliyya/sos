import { db } from '@/prisma/db'
import { DashboardHeader } from '@/app/dashboard/components/DashboardHeader'
import MonthReportOfPractices from './components/MonthReportOfPractices'

export default async function ReportsPage() {
    const now = new Date()

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const practices = db.practice.findMany({
        where: {
            starts_at: { gte: monthStart },
            ends_at: { lte: monthEnd },
            class: { isNot: null },
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

    return (
        <div className='container mx-auto px-4 py-6'>
            <DashboardHeader heading='Reportes' text='' />

            <section className='mt-6'>
                <MonthReportOfPractices
                    selectedMonth={now.getMonth() + 1}
                    selectedYear={now.getFullYear()}
                    data={practices}
                />
            </section>
            {/* <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-2xl font-bold'>Rubrica de Prácticas</h2>
                <MonthSelector onMonthChange={handleMonthChange} />
            </div> */}

            {/* <RubricTable
                students={sampleStudents}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
            /> */}
        </div>
    )
}
