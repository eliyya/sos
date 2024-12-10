import { Metadata } from 'next'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

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
            {/* <AdminDashboard /> */}
        </>
    )
}
