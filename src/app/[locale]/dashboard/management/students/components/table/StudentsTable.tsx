'use client'

import { Student, STATUS } from '@/prisma/generated/browser'
import { Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/Button'
import {
    openDialogAtom,
    selectedStudentNCAtom,
} from '@/global/students.globals'
import { useSetAtom } from 'jotai'
import { SearchStudentsPromise } from '@/hooks/students.hooks'
import { use } from 'react'
import { SearchStudentsContext } from '@/contexts/students.context'
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
} from '@/components/Table'

interface StudentItemListProps {
    student: Awaited<SearchStudentsPromise>[number]
}
export function StudentItemList({ student }: StudentItemListProps) {
    return (
        <TableRow key={student.nc}>
            <TableCell>{student.firstname}</TableCell>
            <TableCell>{student.lastname}</TableCell>
            <TableCell>{student.career?.alias || 'Deleted Career'}</TableCell>
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

export function StudentsTable() {
    const { studentsPromise } = use(SearchStudentsContext)
    const students = use(studentsPromise)

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apellido</TableHead>
                        <TableHead>Carrera</TableHead>
                        <TableHead>Semestre</TableHead>
                        <TableHead>Options</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map(entity => (
                        <StudentItemList key={entity.nc} student={entity} />
                    ))}
                </TableBody>
            </Table>
        </>
    )
}
