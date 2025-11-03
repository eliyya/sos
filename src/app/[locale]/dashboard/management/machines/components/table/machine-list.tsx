'use client'

import { Machine, MACHINE_STATUS } from '@/prisma/generated/browser'
import { useSetAtom } from 'jotai'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MonitorCheckIcon,
    MonitorCogIcon,
    MonitorOffIcon,
    Pencil,
} from 'lucide-react'
import { Button } from '@/components/Button'
import { TableRow, TableCell } from '@/components/Table'
import { use } from 'react'
import { SearchMachinesContext } from '@/contexts/machines.context'
import { SearchMachinesPromise } from '@/hooks/machines.hooks'
import {
    openDialogAtom,
    selectedMachineIdAtom,
} from '@/global/machines.globals'

interface MachineItemListProps {
    machine: Awaited<SearchMachinesPromise>['machines'][number]
}
export function MachineItem({ machine }: MachineItemListProps) {
    return (
        <TableRow>
            <TableCell>@{machine.number}</TableCell>
            <TableCell>
                {machine.processor} {machine.ram} {machine.storage}
            </TableCell>
            <TableCell>{machine.serie}</TableCell>
            <TableCell>{machine.description}</TableCell>
            <TableCell>{machine.laboratory?.name ?? 'Sin asignar'}</TableCell>
            <TableCell className='flex gap-1'>
                <Buttons machine={machine} />
            </TableCell>
        </TableRow>
    )
}

interface ButtonsProps {
    machine: Machine
}
function Buttons({ machine }: ButtonsProps) {
    const openDialog = useSetAtom(openDialogAtom)
    const setSubjectSelected = useSetAtom(selectedMachineIdAtom)
    if (
        machine.status === MACHINE_STATUS.AVAILABLE ||
        machine.status === MACHINE_STATUS.IN_USE
    )
        return (
            <>
                {/* Editar */}
                <Button
                    size='icon'
                    onClick={() => {
                        openDialog('EDIT')
                        setSubjectSelected(machine.id)
                    }}
                >
                    <Pencil className='text-xs' />
                </Button>
                {/* Archivar */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSubjectSelected(machine.id)
                        openDialog('ARCHIVE')
                    }}
                >
                    <MonitorCogIcon className='w-xs text-xs' />
                </Button>
            </>
        )
    if (machine.status === MACHINE_STATUS.MAINTENANCE)
        return (
            <>
                {/* Unarchive */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSubjectSelected(machine.id)
                        openDialog('UNARCHIVE')
                    }}
                >
                    <MonitorCheckIcon className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSubjectSelected(machine.id)
                        openDialog('DELETE')
                    }}
                >
                    <MonitorOffIcon className='w-xs text-xs' />
                </Button>
            </>
        )

    return <></>
}

export function MachineList() {
    const { machinesPromise } = use(SearchMachinesContext)
    const { machines } = use(machinesPromise)

    if (!machines.length)
        return (
            <TableRow>
                <TableCell className='text-center' colSpan={5}>
                    No se encontraron resultados
                </TableCell>
            </TableRow>
        )

    return machines.map(entity => (
        <MachineItem key={entity.id} machine={entity} />
    ))
}

export function FoooterTable() {
    const { changeFilters, filters, machinesPromise } = use(
        SearchMachinesContext,
    )
    const { count } = use(machinesPromise)

    return (
        <div className='flex items-center justify-center gap-5'>
            <Button
                variant='outline'
                size='sm'
                onClick={() =>
                    changeFilters({
                        page: filters.page - 1,
                    })
                }
                disabled={filters.page === 1}
            >
                <ChevronLeftIcon className='h-4 w-4' />
                Anterior
            </Button>
            <div className='text-sm font-medium'>
                Página {filters.page} de {Math.ceil(count || 1 / filters.size)}
            </div>
            <Button
                variant='outline'
                size='sm'
                onClick={() =>
                    changeFilters({
                        page: filters.page + 1,
                    })
                }
                disabled={filters.page === Math.ceil(count / filters.size)}
            >
                Siguiente
                <ChevronRightIcon className='h-4 w-4' />
            </Button>
        </div>
    )
}
