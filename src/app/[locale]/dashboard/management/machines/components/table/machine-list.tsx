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
import { Button } from '@/components/ui/button'
import { TableRow, TableCell } from '@/components/Table'
import { use } from 'react'
import { SearchMachinesContext } from '@/contexts/machines.context'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { SearchMachinesPromise } from '@/hooks/search.hooks'

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
    const openDialog = useSetAtom(dialogAtom)
    const setSubjectSelected = useSetAtom(selectedIdAtom)
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
    const { promise } = use(SearchMachinesContext)
    const { machines } = use(promise)

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
    const { changeFilters, filters, promise } = use(SearchMachinesContext)
    const { pages } = use(promise)

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
                Página {filters.page} de {pages}
            </div>
            <Button
                variant='outline'
                size='sm'
                onClick={() =>
                    changeFilters({
                        page: filters.page + 1,
                    })
                }
                disabled={filters.page === pages}
            >
                Siguiente
                <ChevronRightIcon className='h-4 w-4' />
            </Button>
        </div>
    )
}
