'use client'

import { STATUS, Subject } from '@/prisma/generated/browser'
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
import { SearchSubjectsContext } from '@/contexts/subjects.context'
import { use } from 'react'
import { SearchSubjectsPromise } from '@/hooks/search.hooks'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'

interface StudentItemListProps {
    subject: Awaited<SearchSubjectsPromise>['subjects'][number]
}
export function SubjectItem({ subject }: StudentItemListProps) {
    return (
        <TableRow>
            <TableCell>{subject.name}</TableCell>
            <TableCell className='text-center'>
                {subject.theory_hours}
            </TableCell>
            <TableCell className='text-center'>
                {subject.practice_hours}
            </TableCell>
            <TableCell className='flex gap-1'>
                <Buttons subject={subject} />
            </TableCell>
        </TableRow>
    )
}

interface ButtonsProps {
    subject: Subject
}
function Buttons({ subject }: ButtonsProps) {
    const setDialogOpened = useSetAtom(dialogAtom)
    const setSelectedSubjectId = useSetAtom(selectedIdAtom)
    if (subject.status === STATUS.ACTIVE)
        return (
            <>
                {/* Editar */}
                <Button
                    size='icon'
                    onClick={() => {
                        setDialogOpened('EDIT')
                        setSelectedSubjectId(subject.id)
                    }}
                >
                    <PencilIcon className='text-xs' />
                </Button>
                {/* Archivar */}
                <Button
                    size='icon'
                    onClick={() => {
                        setDialogOpened('ARCHIVE')
                        setSelectedSubjectId(subject.id)
                    }}
                >
                    <ArchiveIcon className='w-xs text-xs' />
                </Button>
            </>
        )
    if (subject.status === STATUS.ARCHIVED)
        return (
            <>
                {/* Unarchive */}
                <Button
                    size='icon'
                    onClick={() => {
                        setDialogOpened('UNARCHIVE')
                        setSelectedSubjectId(subject.id)
                    }}
                >
                    <ArchiveRestoreIcon className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        setDialogOpened('DELETE')
                        setSelectedSubjectId(subject.id)
                    }}
                >
                    <Trash2Icon className='w-xs text-xs' />
                </Button>
            </>
        )
    return <></>
}

export function SubjectsList() {
    const { promise } = use(SearchSubjectsContext)
    const { subjects } = use(promise)

    if (!subjects?.length)
        return (
            <TableRow>
                <TableCell className='text-center' colSpan={5}>
                    No se encontraron resultados
                </TableCell>
            </TableRow>
        )

    return subjects.map(entity => (
        <SubjectItem key={entity.id} subject={entity} />
    ))
}

export function FoooterTable() {
    const { changeFilters, filters, promise } = use(SearchSubjectsContext)
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
