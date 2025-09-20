'use client'

import { User , STATUS } from '@prisma/client'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { getAdminRole, getRoles } from '@/actions/roles'
import { getUsers } from '@/actions/users'
import { Badge } from '@/components/Badge'
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
    EditUserDialogAtom,
    openArchiveUserAtom,
    showArchivedAtom,
    updateAtom,
    entityToEditAtom,
    openUnarchiveUserAtom,
    openDeleteAtom,
    queryAtom,
    adminRoleAtom,
    rolesAtom,
} from '@/global/management-users'

import { ArchiveEntityDialog } from './ArchiveEntityDialog'
import { DeleteEntityDialog } from './DeleteEntityDialog'
import { EditUserDialog } from './EditUserDialog'
import { PreventArchiveAdminDialog } from './PreventArchiveAdmin'
import { UnarchiveEntityDialog } from './UnarchiveEntityDialog'
import { UnarchiveOrDeleteDialog } from './UnarchiveOrDeleteDialog'

export function UsersTable() {
    const [users, setUsers] = useState<User[]>([])
    const update = useAtomValue(updateAtom)
    const archived = useAtomValue(showArchivedAtom)
    const q = useAtomValue(queryAtom)
    const [roles, setRoles] = useAtom(rolesAtom)
    const setAdminRole = useSetAtom(adminRoleAtom)

    useEffect(() => {
        getAdminRole().then(setAdminRole)
    }, [setAdminRole])

    useEffect(() => {
        getUsers().then(setUsers)
    }, [update])

    useEffect(() => {
        getRoles().then(setRoles)
    }, [setRoles])

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Options</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users
                        .filter(
                            u =>
                                (u.status === STATUS.ACTIVE && !archived) ||
                                (u.status === STATUS.ARCHIVED && archived),
                        )
                        .filter(
                            u =>
                                !q ||
                                (q &&
                                    (q.startsWith('@') ?
                                        u.username
                                            .toLowerCase()
                                            .replaceAll(' ', '')
                                            .includes(
                                                q
                                                    .toLowerCase()
                                                    .replaceAll(' ', '')
                                                    .replace('@', ''),
                                            )
                                    :   u.name
                                            .toLowerCase()
                                            .replaceAll(' ', '')
                                            .includes(
                                                q
                                                    .toLowerCase()
                                                    .replaceAll(' ', ''),
                                            ))),
                        )
                        .map(user => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className='flex flex-col'>
                                        <label>{user.name}</label>
                                        <span>@{user.username}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant='outline'>
                                        {
                                            roles.find(
                                                r => r.id === user.role_id,
                                            )?.name
                                        }
                                    </Badge>
                                </TableCell>
                                <TableCell className='flex gap-1'>
                                    <Buttons user={user} />
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <EditUserDialog />
            <ArchiveEntityDialog />
            <UnarchiveEntityDialog />
            <DeleteEntityDialog />
            <UnarchiveOrDeleteDialog />
            <PreventArchiveAdminDialog />
        </>
    )
}

interface ButtonsProps {
    user: User
}
function Buttons({ user }: ButtonsProps) {
    const openEditUserDialog = useSetAtom(EditUserDialogAtom)
    const setUserSelected = useSetAtom(entityToEditAtom)
    const setArchiveUserDialog = useSetAtom(openArchiveUserAtom)
    const openUnarchiveDialog = useSetAtom(openUnarchiveUserAtom)
    const openDeleteDialog = useSetAtom(openDeleteAtom)
    if (user.status === STATUS.ACTIVE)
        return (
            <>
                {/* Editar */}
                <Button
                    size='icon'
                    onClick={() => {
                        openEditUserDialog(true)
                        setUserSelected(user)
                    }}
                >
                    <Pencil className='text-xs' />
                </Button>
                {/* Archivar */}
                <Button
                    size='icon'
                    onClick={() => {
                        setUserSelected(user)
                        setArchiveUserDialog(true)
                    }}
                >
                    <Archive className='w-xs text-xs' />
                </Button>
            </>
        )
    if (user.status === STATUS.ARCHIVED)
        return (
            <>
                {/* Unarchive */}
                <Button
                    size='icon'
                    onClick={() => {
                        setUserSelected(user)
                        openUnarchiveDialog(true)
                    }}
                >
                    <ArchiveRestore className='w-xs text-xs' />
                </Button>
                {/* Delete */}
                <Button
                    size='icon'
                    onClick={() => {
                        setUserSelected(user)
                        openDeleteDialog(true)
                    }}
                >
                    <Trash2 className='w-xs text-xs' />
                </Button>
            </>
        )
    return <></>
}
