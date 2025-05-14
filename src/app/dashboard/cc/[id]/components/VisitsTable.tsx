'use client'

import { Button } from '@/components/Button'
import {
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    Table,
} from '@/components/Table'
import { STATUS, Visit } from '@prisma/client'
import { LogOutIcon } from 'lucide-react'
import { useState } from 'react'

export function VisitsTable() {
    const [visits, setVisits] = useState<Visit[]>([])
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>NC</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Salida</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {visits.map(v => (
                    <TableRow key={v.student_nc}>
                        <TableCell>{v.student_nc}</TableCell>
                        <TableCell>{v.created_at.toDateString()}</TableCell>
                        <TableCell>
                            <Button>
                                <LogOutIcon />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
