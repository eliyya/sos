'use client'

import { Laboratory, STATUS } from '@/prisma/generated/browser'
import { useAtomValue, useSetAtom } from 'jotai'
import { Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import {
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    Table,
} from '@/components/Table'
import { entityToEditAtom } from '@/global/management-laboratory'
import { secondsToTime } from '@/lib/utils'
import { ArchiveDialog } from './ArchiveDialog'
import { DeleteDialog } from './DeleteDialog'
import { EditDialog } from './EditDialog'
import { UnarchiveDialog } from './UnarchiveDialog'
import { UnarchiveOrDeleteDialog } from './UnarchiveOrDeleteDialog'
import { useLaboratories } from '@/hooks/laboratories.hoohs'
import {
    openDialogAtom,
    queryAtom,
    showArchivedAtom,
} from '@/global/laboratories.globals'

export function EntityTable() {
    const { laboratories } = useLaboratories()
    const archived = useAtomValue(showArchivedAtom)
    const q = useAtomValue(queryAtom)

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apertura</TableHead>
                        <TableHead>Cierre</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Opciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {laboratories
                        .filter(
                            u =>
                                (u.status === STATUS.ACTIVE && !archived) ||
                                (u.status === STATUS.ARCHIVED && archived),
                        )
                        .filter(
                            u =>
                                !q ||
                                (q &&
                                    u.name
                                        .toLowerCase()
                                        .replaceAll(' ', '')
                                        .includes(
                                            q.toLowerCase().replaceAll(' ', ''),
                                        )),
                        )
                        .map(entity => (
                            <TableRow key={entity.id}>
                                <TableCell>{entity.name}</TableCell>
                                <TableCell>
                                    {secondsToTime(entity.open_hour * 60)}
                                </TableCell>
                                <TableCell>
                                    {secondsToTime(entity.close_hour * 60)}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            entity.type === 'LABORATORY' ?
                                                'default'
                                            :   'outline'
                                        }
                                    >
                                        {entity.type === 'LABORATORY' ?
                                            'Laboratorio'
                                        :   'Centro de Cómputo'}
                                    </Badge>
                                </TableCell>
                                <TableCell className='flex gap-1'>
                                    <Buttons entity={entity} />
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <EditDialog />
            <ArchiveDialog />
            <UnarchiveDialog />
            <DeleteDialog />
            <UnarchiveOrDeleteDialog />
        </>
    )
}

interface ButtonsProps {
    entity: Laboratory
}
function Buttons({ entity }: ButtonsProps) {
    const setSubjectSelected = useSetAtom(entityToEditAtom)
    const openDialog = useSetAtom(openDialogAtom)

    if (entity.status === STATUS.ACTIVE)
        return (
            <>
                {/* Editar */}
                <Button
                    size='icon'
                    onClick={() => {
                        openDialog('EDIT')
                        setSubjectSelected(entity)
                    }}
                >
                    <Pencil className='text-xs' />
                </Button>
                {/* Archivar */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSubjectSelected(entity)
                        openDialog('ARCHIVE')
                    }}
                >
                    <Archive className='w-xs text-xs' />
                </Button>
            </>
        )
    if (entity.status === STATUS.ARCHIVED)
        return (
            <>
                {/* Unarchive */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSubjectSelected(entity)
                        openDialog('UNARCHIVE')
                    }}
                >
                    <ArchiveRestore className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSubjectSelected(entity)
                        openDialog('DELETE')
                    }}
                >
                    <Trash2 className='w-xs text-xs' />
                </Button>
            </>
        )
    return <></>
}
