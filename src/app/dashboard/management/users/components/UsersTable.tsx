'use client'

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
import { Role, User } from '@prisma/client'
import { STATUS } from '@prisma/client'
import { Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EditUserDialog } from './EditUserDialog'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    EditUserDialogAtom,
    openArchiveUserAtom,
    showArchivedAtom,
    updateUsersAtom,
    userToEditAtom,
    openUnarchiveUserAtom,
    openDeleteUserAtom,
    queryAtom,
} from '@/global/management-users'
import { ArchiveUserDialog } from './ArchiveUserDialog'
import { UnarchiveUserDialog } from './UnarchiveUserDialog'
import { DeleteUserDialog } from './DeleteUserDialog'
import { getRoles } from '@/actions/roles'

export function UsersTable() {
    const [users, setUsers] = useState<User[]>([])
    const update = useAtomValue(updateUsersAtom)
    const archived = useAtomValue(showArchivedAtom)
    const q = useAtomValue(queryAtom)
    const [roles, setRoles] = useState<Role[]>([])

    useEffect(() => {
        getUsers(/*true*/).then(setUsers)
    }, [update])

    useEffect(() => {
        getRoles().then(setRoles)
    }, [])

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
            <ArchiveUserDialog />
            <UnarchiveUserDialog />
            <DeleteUserDialog />
        </>
    )
}

interface ButtonsProps {
    user: User
}
function Buttons({ user }: ButtonsProps) {
    const openEditUserDialog = useSetAtom(EditUserDialogAtom)
    const setUserSelected = useSetAtom(userToEditAtom)
    const setArchiveUserDialog = useSetAtom(openArchiveUserAtom)
    const openUnarchiveDialog = useSetAtom(openUnarchiveUserAtom)
    const openDeleteDialog = useSetAtom(openDeleteUserAtom)
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
