'use client'

import { getUsers } from '@/actions/users'
import { RoleBitField } from '@/bitfields/RoleBitField'
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
import { STATUS, User } from '@prisma/client'
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
} from '@/global/management-users'
import { ArchiveUserDialog } from './DeleteUserDialog'
import { UnarchiveUserDialog } from './UnarchiveUserDialog'

export function UsersTable() {
    const [users, setUsers] = useState<User[]>([])
    const update = useAtomValue(updateUsersAtom)
    const archived = useAtomValue(showArchivedAtom)

    useEffect(() => {
        getUsers().then(setUsers)
    }, [update])

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
                        .map(user => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className='flex flex-col'>
                                        <label>{user.name}</label>
                                        <span>@{user.username}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badges rolesBit={user.role} />
                                </TableCell>
                                <TableCell className='flex gap-0.5'>
                                    <Buttons user={user} />
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <EditUserDialog />
            <ArchiveUserDialog />
            <UnarchiveUserDialog />
        </>
    )
}

interface BadgesProps {
    rolesBit: bigint
}
function Badges({ rolesBit }: BadgesProps) {
    const roles = new RoleBitField(rolesBit)
    return (
        <>
            {Object.entries(roles.serialize())
                .filter(([, b]) => b)
                .map(([f]) => (
                    <Badge
                        variant={
                            f === 'Anonymous' ? 'secondary'
                            : f === 'Admin' ?
                                'default'
                            :   'outline'
                        }
                        key={f}
                    >
                        {f}
                    </Badge>
                ))}
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
                        console.log('clieck')

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
                        setArchiveUserDialog(true)
                    }}
                >
                    <Trash2 className='w-xs text-xs' />
                </Button>
            </>
        )
    return <></>
}
