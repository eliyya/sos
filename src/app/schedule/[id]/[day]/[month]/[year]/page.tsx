import { Metadata } from 'next'
import { WeeklySchedule } from '@/components/shedule/weekly-schedule'
import { Header } from '../../../../../components/Header'

export const metadata: Metadata = {
    title: 'Horario | Lab Reservation System',
    description: 'Horario semanal de reservas de laboratorio',
}

export default function SchedulePage() {
    return (
        <div className='bg-background min-h-screen'>
            <Header />
            <main className='container mx-auto px-4 py-8'>
                <h1 className='mb-8 text-3xl font-bold'>Horario Semanal</h1>
                <WeeklySchedule currentWeek={new Date()} />
            </main>
        </div>
    )
}
