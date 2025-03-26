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
import { Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EditUserDialog } from './EditUserDialog'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    EditUserDialogAtom,
    openArchiveUser,
    updateUsersAtom,
    userToEditAtom,
} from '@/global/management-users'
import { ArchiveUserDialog } from './DeleteUserDialog'

export function UsersTable() {
    const [users, setUsers] = useState<User[]>([])
    const openEditUserDialog = useSetAtom(EditUserDialogAtom)
    const setUserSelected = useSetAtom(userToEditAtom)
    const update = useAtomValue(updateUsersAtom)
    const setArchiveUserDialog = useSetAtom(openArchiveUser)

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
                        .filter(u => u.status === STATUS.ACTIVE)
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
                                        <Trash2 className='w-xs text-xs' />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <EditUserDialog />
            <ArchiveUserDialog />
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
