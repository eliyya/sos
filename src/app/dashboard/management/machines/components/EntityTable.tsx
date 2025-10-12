'use client'

import { Machine, MACHINE_STATUS } from '@/prisma/generated/browser'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    MonitorCheckIcon,
    MonitorCogIcon,
    MonitorOffIcon,
    Pencil,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { getMachine } from '@/actions/machines'
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
import {
    editDialogAtom,
    openArchiveAtom,
    openDeleteAtom,
    openUnarchiveAtom,
    showArchivedAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/management-machines'
import { ArchiveDialog } from './ArchiveDialog'
import { DeleteDialog } from './DeleteDialog'
import { EditDialog } from './EditDialog'
import { UnarchiveDialog } from './UnarchiveDialog'
import { useLaboratories } from '@/hooks/laboratories.hoohs'

export function EntityTable() {
    const [entity, setEntity] = useState<Machine[]>([])
    const update = useAtomValue(updateAtom)
    const archived = useAtomValue(showArchivedAtom)
    const { laboratories } = useLaboratories()

    useEffect(() => {
        getMachine().then(setEntity)
    }, [update])

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
                            archived ?
                                u.status === MACHINE_STATUS.MAINTENANCE
                            :   u.status === MACHINE_STATUS.AVAILABLE ||
                                u.status === MACHINE_STATUS.IN_USE,
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
                                    {laboratories.find(
                                        l => l.id === entity.laboratory_id,
                                    )?.name ?? (
                                        <Badge variant='default'>
                                            Disponible
                                        </Badge>
                                    )}
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
    if (
        entity.status === MACHINE_STATUS.AVAILABLE ||
        entity.status === MACHINE_STATUS.IN_USE
    )
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
                    <MonitorCogIcon className='w-xs text-xs' />
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
                    <MonitorCheckIcon className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSubjectSelected(entity)
                        openDeleteDialog(true)
                    }}
                >
                    <MonitorOffIcon className='w-xs text-xs' />
                </Button>
            </>
        )

    return <></>
}
