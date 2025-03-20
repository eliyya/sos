import { Metadata } from 'next'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import {
    AlertCircleIcon,
    BeakerIcon,
    CalendarIcon,
    UsersIcon,
} from 'lucide-react'
import { Card } from '@/components/Card'

export const metadata: Metadata = {
    title: 'panel de Administrador | LabReserve',
    description: 'gestión de laboratorios y usuarios',
}

const stats = [
    {
        title: 'Laboratorios',
        value: '5',
        icon: BeakerIcon,
        description: 'Laboratorios activos',
    },
    {
        title: 'Reservas',
        value: '128',
        icon: CalendarIcon,
        description: 'Reservas este mes',
    },
    {
        title: 'Usuarios',
        value: '45',
        icon: UsersIcon,
        description: 'Docentes registrados',
    },
    {
        title: 'Pendientes',
        value: '3',
        icon: AlertCircleIcon,
        description: 'Solicitudes pendientes',
    },
]

export default function AdminDashboardPage() {
    return (
        <>
            <DashboardHeader
                heading='Panel de Administracion'
                text='Gestiona laboratorio, reservas y usuarios del sistemas.'
            />
            <div className='mt-8 grid gap-8'>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    {stats.map(stat => (
                        <Card key={stat.title} className='p-6'>
                            <div className='flex items-center gap-4'>
                                <div className='bg-primary/10 rounded-full p-3'>
                                    <stat.icon className='text-primary h-6 w-6' />
                                </div>
                                <div>
                                    <p className='text-muted-foreground text-sm font-medium'>
                                        {stat.title}
                                    </p>
                                    <h3 className='text-2xl font-bold'>
                                        {stat.value}
                                    </h3>
                                    <p className='text-muted-foreground mt-1 text-xs'>
                                        {stat.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}
