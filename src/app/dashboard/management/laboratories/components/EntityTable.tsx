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
import { Laboratory } from '@prisma/client'
import { STATUS } from '@prisma/client
import { Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    editDialogAtom,
    openArchiveAtom,
    openDeleteAtom,
    openUnarchiveAtom,
    showArchivedAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/managment-laboratory'
import { getLaboratory } from '@/actions/laboratory'
import { EditDialog } from './EditDialog'
import { ArchiveDialog } from './ArchiveDialog'
import { UnarchiveDialog } from './UnarchiveDialog'
import { DeleteDialog } from './DeleteDialog'
import { minutesToTime } from '@/lib/utils'

export function EntityTable() {
    const [entity, setEntity] = useState<
        Awaited<ReturnType<typeof getLaboratory>>
    >([])
    const update = useAtomValue(updateAtom)
    const archived = useAtomValue(showArchivedAtom)

    useEffect(() => {
        getLaboratory().then(setEntity)
    }, [update])

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apertura</TableHead>
                        <TableHead>Cierre</TableHead>
                        <TableHead>Tipo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entity
                        .filter(
                            u =>
                                (u.status === STATUS.ACTIVE && !archived) ||
                                (u.status === STATUS.ARCHIVED && archived),
                        )
                        .map(entity => (
                            <TableRow key={entity.id}>
                                <TableCell>{entity.name}</TableCell>
                                <TableCell>
                                    {minutesToTime(entity.open_hour)}
                                </TableCell>
                                <TableCell>
                                    {minutesToTime(entity.close_hour)}
                                </TableCell>
                                <TableCell>
                                    {entity.type === 'LABORATORY' ?
                                        'Laboratorio'
                                    :   'Centro de Computo'}
                                </TableCell>
                                <TableCell className='flex gap-0.5'>
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
        </>
    )
}

interface ButtonsProps {
    entity: Laboratory
}
function Buttons({ entity }: ButtonsProps) {
    const openEditDialog = useSetAtom(editDialogAtom)
    const setSubjectSelected = useSetAtom(entityToEditAtom)
    const setArchiveDialog = useSetAtom(openArchiveAtom)
    const openUnarchiveDialog = useSetAtom(openUnarchiveAtom)
    const openDeleteDialog = useSetAtom(openDeleteAtom)
    if (entity.status === STATUS.ACTIVE)
        return (
            <>
                {/* Editar */}
                <Button
                    size='icon'
                    onClick={() => {
                        openEditDialog(true)
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
                        setArchiveDialog(true)
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
                        openUnarchiveDialog(true)
                    }}
                >
                    <ArchiveRestore className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSubjectSelected(entity)
                        openDeleteDialog(true)
                    }}
                >
                    <Trash2 className='w-xs text-xs' />
                </Button>
            </>
        )
    return <></>
}
