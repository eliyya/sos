'use client'

import { Card } from '@/components/ui/card'
import {
    BeakerIcon,
    CalendarIcon,
    UsersIcon,
    AlertCircleIcon,
} from 'lucide-react'

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

export function AdminDashboard() {
    return (
        <div className="grid gap-8 mt-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map(stat => (
                    <Card key={stat.title} className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <stat.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </p>
                                <h3 className="text-2xl font-bold">
                                    {stat.value}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
