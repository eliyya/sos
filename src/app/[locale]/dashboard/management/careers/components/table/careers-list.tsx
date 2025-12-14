'use client'

import { Career, STATUS } from '@/prisma/generated/browser'
import { useSetAtom } from 'jotai'
import {
    ArchiveIcon,
    ArchiveRestoreIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PencilIcon,
    Trash2Icon,
} from 'lucide-react'
import { Button } from '@/components/Button'
import { TableRow, TableCell } from '@/components/Table'
import { use } from 'react'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { SearchCareersContext } from '@/contexts/careers.context'
import { SearchCareersPromise } from '@/hooks/search.hooks'

export function CareersList() {
    const { promise } = use(SearchCareersContext)
    const { careers } = use(promise)

    if (!careers.length)
        return (
            <TableRow>
                <TableCell className='text-center' colSpan={5}>
                    No se encontraron resultados
                </TableCell>
            </TableRow>
        )

    return careers.map(career => <CareerItem key={career.id} career={career} />)
}

interface CareerItemListProps {
    career: Awaited<SearchCareersPromise>['careers'][number]
}
export function CareerItem({ career }: CareerItemListProps) {
    return (
        <TableRow>
            <TableCell>{career.name}</TableCell>
            <TableCell>{career.alias}</TableCell>
            <TableCell className='flex gap-1'>
                <Buttons career={career} />
            </TableCell>
        </TableRow>
    )
}

interface ButtonsProps {
    career: Career
}
function Buttons({ career }: ButtonsProps) {
    const setSelectedId = useSetAtom(selectedIdAtom)
    const openDialog = useSetAtom(dialogAtom)

    if (career.status === STATUS.ACTIVE)
        return (
            <>
                {/* Editar */}
                <Button
                    size='icon'
                    onClick={() => {
                        openDialog('EDIT')
                        setSelectedId(career.id)
                    }}
                >
                    <PencilIcon className='text-xs' />
                </Button>
                {/* Archivar */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSelectedId(career.id)
                        openDialog('ARCHIVE')
                    }}
                >
                    <ArchiveIcon className='w-xs text-xs' />
                </Button>
            </>
        )
    if (career.status === STATUS.ARCHIVED)
        return (
            <>
                {/* Unarchive */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSelectedId(career.id)
                        openDialog('UNARCHIVE')
                    }}
                >
                    <ArchiveRestoreIcon className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSelectedId(career.id)
                        openDialog('DELETE')
                    }}
                >
                    <Trash2Icon className='w-xs text-xs' />
                </Button>
            </>
        )
    return <></>
}

export function FoooterTable() {
    const { changeFilters, filters, promise } = use(SearchCareersContext)
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
