'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { CalendarIcon, ClockIcon, TrashIcon } from 'lucide-react'

const reservations = [
    {
        id: 1,
        lab: 'Laboratorio de Química',
        date: '2024-03-25',
        time: '10:00 - 12:00',
        subject: 'Química General',
        status: 'confirmed',
    },
    {
        id: 2,
        lab: 'Laboratorio de Física',
        date: '2024-03-27',
        time: '14:00 - 16:00',
        subject: 'Física I',
        status: 'pending',
    },
    {
        id: 3,
        lab: 'Laboratorio de Biología',
        date: '2024-03-28',
        time: '08:00 - 10:00',
        subject: 'Biología Celular',
        status: 'confirmed',
    },
]

export function TeacherReservations() {
    const [filter, setFilter] = useState('all')

    const filteredReservations = reservations.filter(reservation => {
        if (filter === 'all') return true
        return reservation.status === filter
    })

    return (
        <div className="grid gap-8 mt-8">
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold">Reservas</h2>
                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="confirmed">
                                    Confirmadas
                                </SelectItem>
                                <SelectItem value="pending">
                                    Pendientes
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button>
                        <CalendarIcon className="mr-2 h-4 w-4" />
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
                            <TableHead>Estado</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredReservations.map(reservation => (
                            <TableRow key={reservation.id}>
                                <TableCell className="font-medium">
                                    {reservation.lab}
                                </TableCell>
                                <TableCell>{reservation.date}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                        {reservation.time}
                                    </div>
                                </TableCell>
                                <TableCell>{reservation.subject}</TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            reservation.status === 'confirmed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {reservation.status === 'confirmed'
                                            ? 'Confirmada'
                                            : 'Pendiente'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">
                                            Ver Detalles
                                        </Button>
                                        <Button variant="destructive" size="sm">
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
