'use client'

import { Visit } from '@/prisma/browser'
import { useAtom } from 'jotai'
import { LogOutIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
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
import { useTranslations } from 'next-intl'

interface VisitsTableProps {
    laboratory_id: string
}
export function VisitsTable({ laboratory_id }: VisitsTableProps) {
    const [visits, setVisits] = useState<Visit[]>([])
    const [tableSignal, refreshTable] = useAtom(updateTableAtom)
    const t = useTranslations('cc')
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
                    <TableHead>{t('cn')}</TableHead>
                    <TableHead>{t('entrance')}</TableHead>
                    <TableHead>{t('exit')}</TableHead>
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
