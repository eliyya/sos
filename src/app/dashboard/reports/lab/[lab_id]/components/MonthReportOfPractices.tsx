'use client'

import { Card } from '@/components/Card'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/Table'
import { use } from 'react'

// Devuelve el número de semana dentro del mes (1 a 5)
function getWeekOfMonth(date: Date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const dayOfMonth = date.getDate()
    const adjustment = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // lunes = 0
    return Math.ceil((dayOfMonth + adjustment) / 7)
}

interface MonthRepoortOfPracticesProps {
    data: Promise<
        {
            class: {
                career: {
                    id: string
                    name: string
                }
            } | null
            starts_at: Date
            ends_at: Date
        }[]
    >
    selectedMonth: number
    selectedYear: number
}
export default function MonthReportOfPractices({
    selectedMonth,
    selectedYear,
    ...props
}: MonthRepoortOfPracticesProps) {
    const practices = use(props.data)
    type WeeklyHours = Record<
        string,
        {
            id: string
            name: string
            weekly_hours: Record<number, number> // semana → horas
        }
    >

    const result: WeeklyHours = {}

    for (const p of practices) {
        const start = new Date(p.starts_at)
        const end = new Date(p.ends_at)
        const week = getWeekOfMonth(start)

        const diffMs = end.getTime() - start.getTime()
        const hours = diffMs / (1000 * 60 * 60)

        const career = p.class?.career
        if (!career) continue

        if (!result[career.id]) {
            result[career.id] = {
                id: career.id,
                name: career.name,
                weekly_hours: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            }
        }

        result[career.id].weekly_hours[week] += hours
    }

    const data = Object.values(result).map(career => ({
        ...career,
        weekly_hours: Object.entries(career.weekly_hours)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([, hours]) => hours),
    }))

    return (
        <Card>
            <h2 className='p-4 text-2xl font-bold tracking-tight'>
                Reporte de horas de prácticas del mes {selectedMonth} de{' '}
                {selectedYear}
            </h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Carrera</TableHead>
                        <TableHead>Semana 1</TableHead>
                        <TableHead>Semana 2</TableHead>
                        <TableHead>Semana 3</TableHead>
                        <TableHead>Semana 4</TableHead>
                        <TableHead>Semana 5</TableHead>
                        <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(career => (
                        <TableRow key={career.id} className='text-center'>
                            <TableCell className='text-left'>
                                {career.name}
                            </TableCell>
                            <TableCell>{career.weekly_hours[0]}</TableCell>
                            <TableCell>{career.weekly_hours[1]}</TableCell>
                            <TableCell>{career.weekly_hours[2]}</TableCell>
                            <TableCell>{career.weekly_hours[3]}</TableCell>
                            <TableCell>{career.weekly_hours[4]}</TableCell>
                            <TableCell>
                                {career.weekly_hours.reduce(
                                    (total, hours) => total + hours,
                                    0,
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={6} className='text-right'>
                            Total
                        </TableCell>
                        <TableCell className='text-center'>
                            {data.reduce(
                                (total, career) =>
                                    total +
                                    career.weekly_hours.reduce(
                                        (total, hours) => total + hours,
                                        0,
                                    ),
                                0,
                            )}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </Card>
    )
}
