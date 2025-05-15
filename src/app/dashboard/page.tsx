import {
    AlertCircleIcon,
    BeakerIcon,
    CalendarIcon,
    UsersIcon,
} from 'lucide-react'
import { Metadata } from 'next'
import { Card } from '@/components/Card'
import { DashboardHeader } from '@/app/dashboard/components/DashboardHeader'
import { db } from '@/lib/db'
import { LABORATORY_TYPE } from '@prisma/client'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Panel de Administrador | SOS',
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

export default async function AdminDashboardPage() {
    const ccs = await db.laboratory.findMany({
        where: {
            type: LABORATORY_TYPE.COMPUTER_CENTER,
        },
    })
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
                <h2 className='text-2xl font-bold tracking-tight'>
                    Centros de Computo
                </h2>
                <div className='grid gap-4 md:grid-cols-2'>
                    {ccs.map(CC => (
                        <Link key={CC.id} href={`/dashboard/cc/${CC.id}`}>
                            <Card className='p-6'>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-primary/10 rounded-full p-3'>
                                        <BeakerIcon className='text-primary h-6 w-6' />
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium'>
                                            {CC.name}
                                        </p>
                                        <h3 className='text-2xl font-bold'>
                                            24
                                        </h3>
                                        <p className='text-muted-foreground mt-1 text-xs'>
                                            Visitas hoy
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}
