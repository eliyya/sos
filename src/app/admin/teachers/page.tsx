import { Metadata } from 'next'
import { AdminDashboard } from '@/components/admin/Dashboard'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardShell } from '@/components/dashboard/DashboardShell'

export const metadata: Metadata = {
    title: 'panel de Administrador | LabReserve',
    description: 'gestión de laboratorios y usuarios',
}

export default function AdminDashboardPage() {
    return (
        <>
            <DashboardHeader
                heading="panel de Administracion"
                text="gestiona laboratorio, reservas y usuarios del sistemas."
            />
            <AdminDashboard />
        </>
    )
}
