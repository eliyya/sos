'use client'

import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/Table'
import { CalendarIcon, ClockIcon } from 'lucide-react'

const upcomingReservations = [
    {
        id: 1,
        lab: 'Laboratorio de Química',
        date: '2024-03-25',
        time: '10:00 - 12:00',
        subject: 'Química General',
    },
    {
        id: 2,
        lab: 'Laboratorio de Física',
        date: '2024-03-27',
        time: '14:00 - 16:00',
        subject: 'Física I',
    },
]

export function TeacherDashboard() {
    return (
        <div className='mt-8 grid gap-8'>
            <Card className='p-6'>
                <div className='mb-6 flex items-center justify-between'>
                    <h2 className='text-xl font-semibold'>Próximas Reservas</h2>
                    <Button>
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        Nueva Reserva
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Laboratorio</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Horario</TableHead>
                            <TableHead>Materia</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {upcomingReservations.map(reservation => (
                            <TableRow key={reservation.id}>
                                <TableCell>{reservation.lab}</TableCell>
                                <TableCell>{reservation.date}</TableCell>
                                <TableCell>
                                    <div className='flex items-center gap-2'>
                                        <ClockIcon className='text-muted-foreground h-4 w-4' />
                                        {reservation.time}
                                    </div>
                                </TableCell>
                                <TableCell>{reservation.subject}</TableCell>
                                <TableCell>
                                    <Button variant='outline' size='sm'>
                                        Ver Detalles
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
