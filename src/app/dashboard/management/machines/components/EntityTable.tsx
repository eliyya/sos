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
import { Machine, MACHINE_STATUS } from '@prisma/client'
import { Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    editDialogAtom,
    openArchiveAtom,
    openDeleteAtom,
    openUnarchiveAtom,
    showArchivedAtom,
    entityToEditAtom,
    updateAtom,
    laboratoriesAtom,
} from '@/global/management-machines'
import { getMachine } from '@/actions/machines'
import { EditDialog } from './EditDialog'
import { ArchiveDialog } from './ArchiveDialog'
import { UnarchiveDialog } from './UnarchiveDialog'
import { DeleteDialog } from './DeleteDialog'
import { getLaboratories } from '@/actions/laboratory'

export function EntityTable() {
    const [entity, setEntity] = useState<Machine[]>([])
    const update = useAtomValue(updateAtom)
    const archived = useAtomValue(showArchivedAtom)
    const [laboratories, setLaboratories] = useAtom(laboratoriesAtom)

    useEffect(() => {
        getMachine().then(setEntity)
    }, [update])
    useEffect(() => {
        getLaboratories().then(setLaboratories)
    }, [])

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Caracteristicas</TableHead>
                        <TableHead>Serie</TableHead>
                        <TableHead>Descripcion</TableHead>
                        <TableHead>Laboratorio Asignado</TableHead>
                        <TableHead>Opciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entity
                        .filter(u =>
                            archived ? true : (
                                u.status === MACHINE_STATUS.AVAILABLE
                            ),
                        )
                        .map(entity => (
                            <TableRow key={entity.id}>
                                <TableCell>{entity.number}</TableCell>
                                <TableCell>
                                    {entity.processor} {entity.ram}{' '}
                                    {entity.storage}
                                </TableCell>
                                <TableCell>{entity.serie}</TableCell>
                                <TableCell>{entity.description}</TableCell>
                                <TableCell>
                                    {
                                        laboratories.find(
                                            l => l.id === entity.laboratory_id,
                                        )?.name
                                    }
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
        </>
    )
}

interface ButtonsProps {
    entity: Machine
}
function Buttons({ entity }: ButtonsProps) {
    const openEditDialog = useSetAtom(editDialogAtom)
    const setSubjectSelected = useSetAtom(entityToEditAtom)
    const setArchiveDialog = useSetAtom(openArchiveAtom)
    const openUnarchiveDialog = useSetAtom(openUnarchiveAtom)
    const openDeleteDialog = useSetAtom(openDeleteAtom)
    if (entity.status === MACHINE_STATUS.AVAILABLE)
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
    if (entity.status === MACHINE_STATUS.MAINTENANCE)
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
    if (entity.status === MACHINE_STATUS.OUT_OF_SERVICE)
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
    if (entity.status === MACHINE_STATUS.IN_USE)
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
