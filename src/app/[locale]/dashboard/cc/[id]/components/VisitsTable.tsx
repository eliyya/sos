'use client'

import { useAtom } from 'jotai'
import { LogOutIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { finishVisitAction, getTodayVisitsAction } from '@/actions/cc.actions'
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
import { Temporal } from '@js-temporal/polyfill'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { useToast } from '@/hooks/toast.hooks'

interface VisitsTableProps {
    laboratory_id: string
}
export function VisitsTable({ laboratory_id }: VisitsTableProps) {
    const [visits, setVisits] = useState<
        Awaited<ReturnType<typeof getTodayVisitsAction>>
    >([])
    const [tableSignal, refreshTable] = useAtom(updateTableAtom)
    const t = useTranslations('cc')
    const router = useRouter()
    const { Toast, openToast } = useToast()

    useEffect(() => {
        getTodayVisitsAction({
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
                    <TableHead>{t('name')}</TableHead>
                    <TableHead>{t('entrance')}</TableHead>
                    <TableHead>{t('exit')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {visits.map(v => (
                    <TableRow key={v.student_nc}>
                        <TableCell>{v.student_nc}</TableCell>
                        <TableCell>{`${v.student.firstname} ${v.student.lastname}`}</TableCell>
                        <TableCell>
                            {Temporal.Instant.fromEpochMilliseconds(
                                v.created_at.getTime(),
                            )
                                .toZonedDateTimeISO('America/Monterrey')
                                .toLocaleString('es-MX', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                        </TableCell>
                        <TableCell>
                            <Button
                                onClick={() =>
                                    finishVisitAction({ id: v.id }).then(
                                        res => {
                                            if (res.status === 'success') {
                                                refreshTable(Symbol())
                                                return
                                            }
                                            if (res.type === 'unauthorized') {
                                                router.push(
                                                    app.$locale.auth.login(
                                                        'es',
                                                    ),
                                                )
                                                return
                                            } else if (
                                                res.type === 'permission'
                                            ) {
                                                openToast({
                                                    title: 'Error',
                                                    description:
                                                        'No tienes permiso para realizar esta acción.',
                                                    variant: 'destructive',
                                                })
                                                return
                                            }
                                        },
                                    )
                                }
                            >
                                <LogOutIcon />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
                <Toast />
            </TableBody>
        </Table>
    )
}
