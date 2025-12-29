'use client'

import { Class, STATUS } from '@/prisma/generated/browser'
import { useSetAtom } from 'jotai'
import {
    ArchiveIcon,
    ArchiveRestoreIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PencilIcon,
    Trash2Icon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TableRow, TableCell } from '@/components/Table'
import { use } from 'react'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { SearchClassesContext } from '@/contexts/classes.context'
import { SearchClassesPromise } from '@/hooks/search.hooks'

interface ClassItemListProps {
    class_: Awaited<SearchClassesPromise>['classes'][number]
}
export function ClassItem({ class_ }: ClassItemListProps) {
    return (
        <TableRow>
            <TableCell>{class_.subject.displayname}</TableCell>
            <TableCell>{class_.teacher.displayname}</TableCell>
            <TableCell>{class_.career.displayname}</TableCell>
            <TableCell className='flex gap-1'>
                <Buttons class_={class_} />
            </TableCell>
        </TableRow>
    )
}
interface ButtonsProps {
    class_: Class
}
function Buttons({ class_ }: ButtonsProps) {
    const setSelectedId = useSetAtom(selectedIdAtom)
    const openDialog = useSetAtom(dialogAtom)

    if (class_.status === STATUS.ACTIVE)
        return (
            <>
                {/* Editar */}
                <Button
                    size='icon'
                    onClick={() => {
                        openDialog('EDIT')
                        setSelectedId(class_.id)
                    }}
                >
                    <PencilIcon className='text-xs' />
                </Button>
                {/* Archivar */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSelectedId(class_.id)
                        openDialog('ARCHIVE')
                    }}
                >
                    <ArchiveIcon className='w-xs text-xs' />
                </Button>
            </>
        )
    if (class_.status === STATUS.ARCHIVED)
        return (
            <>
                {/* Unarchive */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSelectedId(class_.id)
                        openDialog('UNARCHIVE')
                    }}
                >
                    <ArchiveRestoreIcon className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSelectedId(class_.id)
                        openDialog('DELETE')
                    }}
                >
                    <Trash2Icon className='w-xs text-xs' />
                </Button>
            </>
        )
    return <></>
}

export function ClassesList() {
    const { promise } = use(SearchClassesContext)
    const { classes } = use(promise)

    if (!classes.length)
        return (
            <TableRow>
                <TableCell className='text-center' colSpan={5}>
                    No se encontraron resultados
                </TableCell>
            </TableRow>
        )

    return classes.map(cl => <ClassItem key={cl.id} class_={cl} />)
}

export function FoooterTable() {
    const { changeFilters, filters, promise } = use(SearchClassesContext)
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
