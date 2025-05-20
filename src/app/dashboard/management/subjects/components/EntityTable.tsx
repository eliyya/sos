'use client'

import { Button } from '@/components/Button'
import {
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    Table,
} from '@/components/Table'
import { Subject } from '@prisma/client'
import { STATUS } from '@prisma/client'
import { Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    editDialogAtom,
    openArchiveAtom,
    openDeleteAtom,
    openUnarchiveAtom,
    showArchivedAtom,
    subjectToEditAtom,
    updateAtom,
} from '@/global/management-subjects'
import { getSubjects } from '@/actions/subjects'
import { EditDialog } from './EditDialog'
import { ArchiveDialog } from './ArchiveDialog'
import { UnarchiveDialog } from './UnarchiveDialog'
import { DeleteDialog } from './DeleteDialog'

export function EntityTable() {
    const [subjects, setSubjects] = useState<Subject[]>([])
    const update = useAtomValue(updateAtom)
    const archived = useAtomValue(showArchivedAtom)

    useEffect(() => {
        getSubjects().then(setSubjects)
    }, [update])

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
                        .filter(u => u)
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
                                <TableCell className='flex gap-0.5'>
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
        </>
    )
}

interface ButtonsProps {
    subject: Subject
}
function Buttons({ subject }: ButtonsProps) {
    const openEditDialog = useSetAtom(editDialogAtom)
    const setSubjectSelected = useSetAtom(subjectToEditAtom)
    const setArchiveDialog = useSetAtom(openArchiveAtom)
    const openUnarchiveDialog = useSetAtom(openUnarchiveAtom)
    const openDeleteDialog = useSetAtom(openDeleteAtom)
    if (subject.status === STATUS.ACTIVE)
        return (
            <>
                {/* Editar */}
                <Button
                    size='icon'
                    onClick={() => {
                        openEditDialog(true)
                        setSubjectSelected(subject)
                    }}
                >
                    <Pencil className='text-xs' />
                </Button>
                {/* Archivar */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSubjectSelected(subject)
                        setArchiveDialog(true)
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
                        setSubjectSelected(subject)
                        openUnarchiveDialog(true)
                    }}
                >
                    <ArchiveRestore className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSubjectSelected(subject)
                        openDeleteDialog(true)
                    }}
                >
                    <Trash2 className='w-xs text-xs' />
                </Button>
            </>
        )
    return <></>
}
