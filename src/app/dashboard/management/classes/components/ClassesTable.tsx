'use client'

import { Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react'
import { getDisponibleClassesWithData } from '@/actions/class'
import { UnarchiveDialog } from './UnarchiveDialog'
import { useAtomValue, useSetAtom } from 'jotai'
import { getSubjects } from '@/actions/subjects'
import { ArchiveDialog } from './ArchiveDialog'
import { DeleteDialog } from './DeleteDialog'
import { getCareers } from '@/actions/career'
import { Button } from '@/components/Button'
import { useEffect, useState } from 'react'
import { EditDialog } from './EditDialog'
import { STATUS } from '@prisma/client'
import { Class } from '@prisma/client'
import {
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    Table,
} from '@/components/Table'
import {
    editDialogAtom,
    openArchiveAtom,
    openDeleteAtom,
    openUnarchiveAtom,
    showArchivedAtom,
    entityToEditAtom,
    updateAtom,
    careersAtom,
    subjectsAtom,
    usersAtom,
} from '@/global/management-class'
import { UnarchiveOrDeleteDialog } from './UnarchiveOrDeleteDialog'
import { getUsers } from '@/actions/users'

export function ClassesTable() {
    const [entity, setEntity] = useState<
        Awaited<ReturnType<typeof getDisponibleClassesWithData>>
    >([])
    const archived = useAtomValue(showArchivedAtom)

    const update = useAtomValue(updateAtom)
    useEffect(() => {
        getDisponibleClassesWithData().then(setEntity)
    }, [update])

    // las carreras, materias y usuarios se usan en varios componentes
    const setCareers = useSetAtom(careersAtom)
    const setSubjects = useSetAtom(subjectsAtom)
    const setUsers = useSetAtom(usersAtom)
    useEffect(() => {
        getCareers().then(setCareers)
        getSubjects().then(setSubjects)
        getUsers().then(setUsers)
    }, [setCareers, setSubjects, setUsers])

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Materia</TableHead>
                        <TableHead>Profesor</TableHead>
                        <TableHead>Grupo</TableHead>
                        <TableHead>Options</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entity
                        .filter(
                            u =>
                                (u.status === STATUS.ACTIVE && !archived) ||
                                (u.status === STATUS.ARCHIVED && archived),
                        )
                        .map(entity => (
                            <TableRow key={entity.id}>
                                <TableCell>{entity.subject.name}</TableCell>
                                <TableCell>{entity.teacher.name}</TableCell>
                                <TableCell>
                                    {entity.career.alias || entity.career.name}
                                    {entity.group}-{entity.semester}
                                </TableCell>
                                <TableCell className='flex gap-1'>
                                    <Buttons entity={entity} />
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
    entity: Class
}
function Buttons({ entity }: ButtonsProps) {
    const openEditDialog = useSetAtom(editDialogAtom)
    const setSubjectSelected = useSetAtom(entityToEditAtom)
    const setArchiveDialog = useSetAtom(openArchiveAtom)
    const openUnarchiveDialog = useSetAtom(openUnarchiveAtom)
    const openDeleteDialog = useSetAtom(openDeleteAtom)
    if (entity.status === STATUS.ACTIVE)
        return (
            <>
                {/* Editar */}
                <Button
                    size='icon'
                    onClick={() => {
                        openEditDialog(true)
                        setSubjectSelected(entity)
                    }}
                >
                    <Pencil className='text-xs' />
                </Button>
                {/* Archivar */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSubjectSelected(entity)
                        setArchiveDialog(true)
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
                        setSubjectSelected(entity)
                        openUnarchiveDialog(true)
                    }}
                >
                    <ArchiveRestore className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        setSubjectSelected(entity)
                        openDeleteDialog(true)
                    }}
                >
                    <Trash2 className='w-xs text-xs' />
                </Button>
            </>
        )
    return <></>
}
