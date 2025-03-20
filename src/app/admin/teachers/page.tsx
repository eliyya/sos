import { Metadata } from 'next'
// import { AdminDashboard } from '@/components/admin/Dashboard'
import { DashboardHeader } from '@/app/dashboard/components/DashboardHeader'
import { DashboardShell } from '@/app/dashboard/components/DashboardShell'

export const metadata: Metadata = {
    title: 'panel de Administrador | SOS',
    description: 'gestión de laboratorios y usuarios',
}

export default function AdminDashboardPage() {
    return (
        <>
            <DashboardHeader
                heading='panel de Administracion'
                text='gestiona laboratorio, reservas y usuarios del sistemas.'
            />
            {/* <AdminDashboard /> */}
        </>
    )
}
