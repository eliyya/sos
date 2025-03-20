import { Metadata } from 'next'
import { TeacherReservations } from '@/components/teacher/reservations'
import { DashboardHeader } from '@/app/dashboard/components/DashboardHeader'
import { DashboardShell } from '@/app/dashboard/components/DashboardShell'

export const metadata: Metadata = {
    title: 'Mis Reservas | LabReserve',
    description: 'Gestiona tus reservas de laboratorio',
}

export default function TeacherReservationsPage() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading='Mis Reservas'
                text='Visualiza y gestiona tus reservas de laboratorio.'
            />
            <TeacherReservations />
        </DashboardShell>
    )
}
