'use client'

import { Career, STATUS } from '@/prisma/browser'
import { useAtomValue, useSetAtom } from 'jotai'
import { Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCareers } from '@/actions/career'
import { Button } from '@/components/Button'
import {
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    Table,
} from '@/components/Table'
import {
    editDialogAtom,
    openArchiveAtom,
    openDeleteAtom,
    openUnarchiveAtom,
    showArchivedAtom,
    entityToEditAtom,
    updateAtom,
    queryAtom,
} from '@/global/management-career'
import { ArchiveDialog } from './ArchiveDialog'
import { DeleteDialog } from './DeleteDialog'
import { EditDialog } from './EditDialog'
import { UnarchiveDialog } from './UnarchiveDialog'
import { UnarchiveOrDeleteDialog } from './UnarchiveOrDeleteDialog'

export function CareersTable() {
    const [entity, setEntity] = useState<Career[]>([])
    const update = useAtomValue(updateAtom)
    const archived = useAtomValue(showArchivedAtom)
    const q = useAtomValue(queryAtom)

    useEffect(() => {
        getCareers().then(setEntity)
    }, [update])

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Carrera</TableHead>
                        <TableHead>Alias</TableHead>
                        <TableHead>Options</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entity
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
                                        )) ||
                                u.alias
                                    ?.toLowerCase()
                                    .replaceAll(' ', '')
                                    .includes(
                                        q.toLowerCase().replaceAll(' ', ''),
                                    ),
                        )
                        .map(entity => (
                            <TableRow key={entity.id}>
                                <TableCell>{entity.name}</TableCell>
                                <TableCell>{entity.alias ?? ''}</TableCell>
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
    entity: Career
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
