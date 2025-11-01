'use client'

import { Student, STATUS } from '@/prisma/generated/browser'
import {
    Archive,
    ArchiveRestore,
    ChevronLeftIcon,
    ChevronRightIcon,
    Pencil,
    Trash2,
} from 'lucide-react'
import { Button } from '@/components/Button'
import {
    openDialogAtom,
    selectedStudentNCAtom,
} from '@/global/students.globals'
import { useSetAtom } from 'jotai'
import { SearchStudentsPromise } from '@/hooks/students.hooks'
import { use } from 'react'
import { SearchStudentsContext } from '@/contexts/students.context'
import { TableRow, TableCell } from '@/components/Table'

interface StudentItemListProps {
    student: Awaited<SearchStudentsPromise>['students'][number]
}
export function StudentItem({ student }: StudentItemListProps) {
    return (
        <TableRow>
            <TableCell>{student.firstname}</TableCell>
            <TableCell>{student.lastname}</TableCell>
            <TableCell>{student.career?.alias ?? 'Deleted Career'}</TableCell>
            <TableCell>{student.semester}</TableCell>
            <TableCell className='flex gap-1'>
                <Buttons entity={student} />
            </TableCell>
        </TableRow>
    )
}

interface ButtonsProps {
    entity: Student
}
function Buttons({ entity }: ButtonsProps) {
    const openDialog = useSetAtom(openDialogAtom)
    const selectStudent = useSetAtom(selectedStudentNCAtom)
    if (entity.status === STATUS.ACTIVE)
        return (
            <>
                {/* Editar */}
                <Button
                    size='icon'
                    onClick={() => {
                        openDialog('EDIT')
                        selectStudent(entity.nc)
                    }}
                >
                    <Pencil className='text-xs' />
                </Button>
                {/* Archivar */}
                <Button
                    size='icon'
                    onClick={() => {
                        selectStudent(entity.nc)
                        openDialog('ARCHIVE')
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
                        selectStudent(entity.nc)
                        openDialog('UNARCHIVE')
                    }}
                >
                    <ArchiveRestore className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        selectStudent(entity.nc)
                        openDialog('DELETE')
                    }}
                >
                    <Trash2 className='w-xs text-xs' />
                </Button>
            </>
        )
    return <></>
}

export function StudentsList() {
    const { studentsPromise } = use(SearchStudentsContext)
    const { students } = use(studentsPromise)

    if (!students.length)
        return (
            <TableRow>
                <TableCell className='text-center' colSpan={5}>
                    No se encontraron resultados
                </TableCell>
            </TableRow>
        )

    return students.map(entity => (
        <StudentItem key={entity.nc} student={entity} />
    ))
}

export function FoooterTable() {
    const { changeFilters, filters, studentsPromise } = use(
        SearchStudentsContext,
    )
    const { count } = use(studentsPromise)

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
