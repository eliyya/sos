'use client'

import { endVisit, getVisitsToday } from '@/actions/cc'
import { Button } from '@/components/Button'
import {
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    Table,
} from '@/components/Table'
import { updateTableAtom } from '@/global/cc'
import { Visit } from '@prisma/client'
import { useAtom } from 'jotai'
import { LogOutIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface VisitsTableProps {
    laboratory_id: string
}
export function VisitsTable({ laboratory_id }: VisitsTableProps) {
    const [visits, setVisits] = useState<Visit[]>([])
    const [tableSignal, refreshTable] = useAtom(updateTableAtom)

    useEffect(() => {
        getVisitsToday({
            laboratory_id: laboratory_id,
        }).then(visits => {
            setVisits(visits)
        })
    }, [laboratory_id, tableSignal])

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
                            <Button
                                onClick={() =>
                                    endVisit({ id: v.id }).then(() =>
                                        refreshTable(Symbol()),
                                    )
                                }
                            >
                                <LogOutIcon />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
