'use client'

import { Machine, MACHINE_STATUS } from '@/prisma/generated/browser'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    MonitorCheckIcon,
    MonitorCogIcon,
    MonitorOffIcon,
    Pencil,
} from 'lucide-react'
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
    openDialogAtom,
    selectedMachineIdAtom,
} from '@/global/machines.globals'
import { ArchiveDialog } from './ArchiveDialog'
import { DeleteDialog } from './DeleteDialog'
import { EditDialog } from './EditDialog'
import { UnarchiveDialog } from './UnarchiveDialog'
import { useLaboratories } from '@/hooks/laboratories.hoohs'
import { useMachines } from '@/hooks/machines.hooks'
import { useQueryParam } from '@/hooks/query.hooks'

export function EntityTable() {
    const [archived] = useQueryParam('archived', false)
    const { laboratories } = useLaboratories()
    const { machines } = useMachines()

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
                    {machines
                        // TODO: implement search
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
    const openDialog = useSetAtom(openDialogAtom)
    const setSubjectSelected = useSetAtom(selectedMachineIdAtom)
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
                        openDialog('EDIT')
                        setSubjectSelected(entity.id)
                    }}
                >
                    <Pencil className='text-xs' />
                </Button>
                {/* Archivar */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSubjectSelected(entity.id)
                        openDialog('ARCHIVE')
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
                        setSubjectSelected(entity.id)
                        openDialog('UNARCHIVE')
                    }}
                >
                    <MonitorCheckIcon className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSubjectSelected(entity.id)
                        openDialog('DELETE')
                    }}
                >
                    <MonitorOffIcon className='w-xs text-xs' />
                </Button>
            </>
        )

    return <></>
}
