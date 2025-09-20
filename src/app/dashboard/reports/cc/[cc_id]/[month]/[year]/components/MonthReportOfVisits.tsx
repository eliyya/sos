'use client'

import { use } from 'react'

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

// Devuelve el número de semana dentro del mes (1 a 5)
function getWeekOfMonth(date: Date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const dayOfMonth = date.getDate()
    const adjustment = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // lunes = 0
    return Math.ceil((dayOfMonth + adjustment) / 7)
}

interface MonthReportOfVisitsProps {
    data: Promise<
        {
            student: {
                career: {
                    name: string
                    id: string
                }
            }
            created_at: Date
        }[]
    >
    selectedMonth: string
    selectedYear: number
    carrers: string[]
}
export function MonthReportOfVisits({
    selectedMonth,
    selectedYear,
    carrers,
    ...props
}: MonthReportOfVisitsProps) {
    const visits = use(props.data)

    type WeeklyVisits = Record<
        string,
        {
            id: string
            name: string
            weekly_visits: Record<number, number>
        }
    >

    const result: WeeklyVisits = {}

    for (const v of visits) {
        const date = new Date(v.created_at)
        const week = getWeekOfMonth(date)

        const career = v.student?.career
        if (!career) continue

        if (!result[career.id]) {
            result[career.id] = {
                id: career.id,
                name: career.name,
                weekly_visits: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            }
        }

        if (!result[career.id].weekly_visits[week]) {
            result[career.id].weekly_visits[week] = 0
        }

        result[career.id].weekly_visits[week]++
    }

    const data = Object.values(result).map(career => ({
        ...career,
        weekly_visits: Object.entries(career.weekly_visits)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([, visits]) => visits),
    }))
    for (const career of carrers) {
        if (!data.find(c => c.name === career)) {
            data.push({
                id: '',
                name: career,
                weekly_visits: [0, 0, 0, 0, 0],
            })
        }
    }

    return (
        <Card>
            <h2 className='p-4 text-2xl font-bold tracking-tight'>
                Reporte de visitas del mes {selectedMonth} de {selectedYear}
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
                            <TableCell>{career.weekly_visits[0]}</TableCell>
                            <TableCell>{career.weekly_visits[1]}</TableCell>
                            <TableCell>{career.weekly_visits[2]}</TableCell>
                            <TableCell>{career.weekly_visits[3]}</TableCell>
                            <TableCell>{career.weekly_visits[4]}</TableCell>
                            <TableCell>
                                {career.weekly_visits.reduce(
                                    (total, visits) => total + visits,
                                    0,
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow className='text-center'>
                        <TableCell colSpan={6} className='text-right'>
                            Total
                        </TableCell>
                        <TableCell className='text-center'>
                            {data.reduce(
                                (total, career) =>
                                    total +
                                    career.weekly_visits.reduce(
                                        (total, visits) => total + visits,
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
