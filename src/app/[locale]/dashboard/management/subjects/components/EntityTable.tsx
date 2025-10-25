'use client'

import { Subject, STATUS } from '@/prisma/generated/browser'
import { useAtomValue, useSetAtom } from 'jotai'
import { Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react'
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
    queryAtom,
    selectedSubjectIdAtom,
    showArchivedAtom,
} from '@/global/subjects.globals'
import { ArchiveDialog } from './ArchiveDialog'
import { DeleteDialog } from './DeleteDialog'
import { EditDialog } from './EditDialog'
import { UnarchiveDialog } from './UnarchiveDialog'
import { UnarchiveOrDeleteDialog } from './UnarchiveOrDeleteDialog'
import { useSubjects } from '@/hooks/subjects.hooks'

export function EntityTable() {
    const archived = useAtomValue(showArchivedAtom)
    const q = useAtomValue(queryAtom)
    const { subjects } = useSubjects()

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Materia</TableHead>
                        <TableHead className='text-center'>
                            Horas Teoricas
                        </TableHead>
                        <TableHead className='text-center'>
                            Horas Practicas
                        </TableHead>
                        <TableHead>Options</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subjects
                        .filter(
                            u =>
                                (u.status === STATUS.ACTIVE && !archived) ||
                                (u.status === STATUS.ARCHIVED && archived),
                        )
                        .filter(
                            u =>
                                !q ||
                                (q &&
                                    u.name
                                        .toLowerCase()
                                        .replaceAll(' ', '')
                                        .includes(
                                            q.toLowerCase().replaceAll(' ', ''),
                                        )),
                        )
                        .map(user => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className='flex flex-col'>
                                        <label>{user.name}</label>
                                    </div>
                                </TableCell>
                                <TableCell className='text-center'>
                                    <label>{user.theory_hours}</label>
                                </TableCell>
                                <TableCell className='text-center'>
                                    <label>{user.practice_hours}</label>
                                </TableCell>
                                <TableCell className='flex gap-1'>
                                    <Buttons subject={user} />
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <EditDialog />
            <ArchiveDialog />
            <UnarchiveDialog />
            <DeleteDialog />
            <UnarchiveOrDeleteDialog />
        </>
    )
}

interface ButtonsProps {
    subject: Subject
}
function Buttons({ subject }: ButtonsProps) {
    const openDialog = useSetAtom(openDialogAtom)
    const select = useSetAtom(selectedSubjectIdAtom)

    if (subject.status === STATUS.ACTIVE)
        return (
            <>
                {/* Editar */}
                <Button
                    size='icon'
                    onClick={() => {
                        openDialog('EDIT')
                        select(subject.id)
                    }}
                >
                    <Pencil className='text-xs' />
                </Button>
                {/* Archivar */}
                <Button
                    size='icon'
                    onClick={() => {
                        select(subject.id)
                        openDialog('ARCHIVE')
                    }}
                >
                    <Archive className='w-xs text-xs' />
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
                        select(subject.id)
                        openDialog('UNARCHIVE')
                    }}
                >
                    <ArchiveRestore className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        select(subject.id)
                        openDialog('DELETE')
                    }}
                >
                    <Trash2 className='w-xs text-xs' />
                </Button>
            </>
        )
    return <></>
}
