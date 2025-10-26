'use client'

import { STATUS, Class } from '@/prisma/generated/browser'
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
import { openDialogAtom, selectedClassIdAtom } from '@/global/classes.globals'
import { ArchiveDialog } from './ArchiveDialog'
import { DeleteDialog } from './DeleteDialog'
import { EditDialog } from './EditDialog'
import { UnarchiveDialog } from './UnarchiveDialog'
import { UnarchiveOrDeleteDialog } from './UnarchiveOrDeleteDialog'
import { useTranslations } from 'next-intl'
import { useClasses } from '@/hooks/classes.hooks'
import { useUsers } from '@/hooks/users.hooks'
import { useSubjects } from '@/hooks/subjects.hooks'
import { useCareers } from '@/hooks/careers.hooks'
import { useQueryParam } from '@/hooks/query.hooks'

export function ClassesTable() {
    const [archived] = useQueryParam('archived', false)
    const { classes } = useClasses()
    const { users } = useUsers()
    const { subjects } = useSubjects()
    const { careers } = useCareers()

    const t = useTranslations('classes')
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('subject')}</TableHead>
                        <TableHead>{t('teacher')}</TableHead>
                        <TableHead>{t('group')}</TableHead>
                        <TableHead>{t('options')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {classes
                        // TODO: implement search
                        .filter(
                            u =>
                                (u.status === STATUS.ACTIVE && !archived) ||
                                (u.status === STATUS.ARCHIVED && archived),
                        )
                        .map(entity => (
                            <TableRow key={entity.id}>
                                <TableCell>
                                    {
                                        subjects.find(
                                            s => s.id === entity.subject_id,
                                        )?.name
                                    }
                                </TableCell>
                                <TableCell>
                                    {
                                        users.find(
                                            u => u.id === entity.teacher_id,
                                        )?.name
                                    }
                                </TableCell>
                                <TableCell>
                                    {careers.find(
                                        c => c.id === entity.career_id,
                                    )?.alias ||
                                        careers.find(
                                            c => c.id === entity.career_id,
                                        )?.name}
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
    const openDialog = useSetAtom(openDialogAtom)
    const selectClass = useSetAtom(selectedClassIdAtom)
    if (entity.status === STATUS.ACTIVE)
        return (
            <>
                {/* Editar */}
                <Button
                    size='icon'
                    onClick={() => {
                        openDialog('EDIT')
                        selectClass(entity.id)
                    }}
                >
                    <Pencil className='text-xs' />
                </Button>
                {/* Archivar */}
                <Button
                    size='icon'
                    onClick={() => {
                        selectClass(entity.id)
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
                        selectClass(entity.id)
                        openDialog('UNARCHIVE')
                    }}
                >
                    <ArchiveRestore className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        selectClass(entity.id)
                        openDialog('DELETE')
                    }}
                >
                    <Trash2 className='w-xs text-xs' />
                </Button>
            </>
        )
    return <></>
}
