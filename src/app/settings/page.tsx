import { Metadata } from 'next'
import { SettingsForm } from '@/components/settings/setting-form'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

export const metadata: Metadata = {
    title: 'Configuración | LabReserve',
    description: 'Gestiona tu cuenta y preferencias',
}

export default function SettingsPage() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading="Configuración"
                text="Administra tu cuenta y preferencias del sistema."
            />
            <SettingsForm />
        </DashboardShell>
    )
}
