import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { TeacherDashboard } from '@/components/teacher/dashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'panel  de docentes',
    description: 'gestion de reservar y horarios',
}

export default function SettingsPage() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="panel de docentes "
                text="Administra tu cuenta  "
            />
            <TeacherDashboard />
        </DashboardShell>
    )
}
