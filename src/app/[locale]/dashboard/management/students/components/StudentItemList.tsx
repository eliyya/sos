'use client'

import { Student, STATUS, Career } from '@/prisma/generated/browser'
import { Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/Button'
import {
    openDialogAtom,
    selectedStudentNCAtom,
} from '@/global/students.globals'
import { useSetAtom } from 'jotai'
import { TableCell, TableRow } from '@/components/Table'

interface StudentItemListProps {
    student: Student
    careers: Career[]
}
export function StudentItemList({ student, careers }: StudentItemListProps) {
    return (
        <TableRow key={student.nc}>
            <TableCell>{student.firstname}</TableCell>
            <TableCell>{student.lastname}</TableCell>
            <TableCell>
                {careers.find(c => c.id === student.career_id)?.alias ??
                    'Deleted Career'}
            </TableCell>
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
