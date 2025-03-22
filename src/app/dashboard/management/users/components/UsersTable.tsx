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
import { User } from '@prisma/client'
import { Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export function UsersTable() {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        getUsers().then(setUsers)
    }, [])

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Options</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map(user => (
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
                            <Button size='icon'>
                                <Pencil className='text-xs' />
                            </Button>
                            <Button size='icon'>
                                <Trash2 className='w-xs text-xs' />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
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
