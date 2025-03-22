import { Metadata } from 'next'
// import { SettingsForm } from '@/components/settings/setting-form'
import { DashboardHeader } from '@/app/dashboard/components/DashboardHeader'
import { DashboardShell } from '@/app/dashboard/components/DashboardShell'

export const metadata: Metadata = {
    title: 'Configuración | SOS',
    description: 'Gestiona tu cuenta y preferencias',
}

export default function SettingsPage() {
    return (
        <DashboardShell>
            <DashboardHeader
                heading='Configuración'
                text='Administra tu cuenta y preferencias del sistema.'
            />
            {/* <SettingsForm /> */}
        </DashboardShell>
    )
}
