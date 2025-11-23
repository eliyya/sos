'use client'

import { Laboratory, STATUS } from '@/prisma/generated/browser'
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
import { SearchLaboratoriesPromise } from '@/hooks/search.hooks'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { secondsToTime } from '@/lib/utils'
import { Badge } from '@/components/Badge'
import { SearchLaboratoriesContext } from '@/contexts/laboratories.context'

export function LaboratoriesList() {
    const { promise } = use(SearchLaboratoriesContext)
    const { laboratories } = use(promise)

    console.log({ laboratories })

    if (!laboratories?.length)
        return (
            <TableRow>
                <TableCell className='text-center' colSpan={5}>
                    No se encontraron resultados
                </TableCell>
            </TableRow>
        )

    return laboratories.map(entity => (
        <LaboratoryItem key={entity.id} laboratory={entity} />
    ))
}

interface ButtonsProps {
    laboratory: Laboratory
}
function Buttons({ laboratory }: ButtonsProps) {
    const setDialogOpened = useSetAtom(dialogAtom)
    const setSelectedSubjectId = useSetAtom(selectedIdAtom)
    if (laboratory.status === STATUS.ACTIVE)
        return (
            <>
                {/* Editar */}
                <Button
                    size='icon'
                    onClick={() => {
                        setDialogOpened('EDIT')
                        setSelectedSubjectId(laboratory.id)
                    }}
                >
                    <PencilIcon className='text-xs' />
                </Button>
                {/* Archivar */}
                <Button
                    size='icon'
                    onClick={() => {
                        setDialogOpened('ARCHIVE')
                        setSelectedSubjectId(laboratory.id)
                    }}
                >
                    <ArchiveIcon className='w-xs text-xs' />
                </Button>
            </>
        )
    if (laboratory.status === STATUS.ARCHIVED)
        return (
            <>
                {/* Unarchive */}
                <Button
                    size='icon'
                    onClick={() => {
                        setDialogOpened('UNARCHIVE')
                        setSelectedSubjectId(laboratory.id)
                    }}
                >
                    <ArchiveRestoreIcon className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        setDialogOpened('DELETE')
                        setSelectedSubjectId(laboratory.id)
                    }}
                >
                    <Trash2Icon className='w-xs text-xs' />
                </Button>
            </>
        )
    return <></>
}

export function FoooterTable() {
    const { changeFilters, filters, promise } = use(SearchLaboratoriesContext)
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
                size='default'
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

interface LaboratoryItemListProps {
    laboratory: Awaited<SearchLaboratoriesPromise>['laboratories'][number]
}
export function LaboratoryItem({ laboratory }: LaboratoryItemListProps) {
    return (
        <TableRow>
            <TableCell>{laboratory.name}</TableCell>
            <TableCell>{secondsToTime(laboratory.open_hour * 60)}</TableCell>
            <TableCell>{secondsToTime(laboratory.close_hour * 60)}</TableCell>
            <TableCell>
                <Badge
                    variant={
                        laboratory.type === 'LABORATORY' ? 'default' : 'outline'
                    }
                >
                    {laboratory.type === 'LABORATORY' ?
                        'Laboratorio'
                    :   'Centro de Cómputo'}
                </Badge>
            </TableCell>
            <TableCell className='flex gap-1'>
                <Buttons laboratory={laboratory} />
            </TableCell>
        </TableRow>
    )
}
