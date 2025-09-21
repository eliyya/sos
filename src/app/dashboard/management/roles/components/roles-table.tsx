'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { SearchIcon } from 'lucide-react'
import { useEffect } from 'react'
import { getRoles, getUsersCountPerRole } from '@/actions/roles.actions'
import { Badge } from '@/components/Badge'
import { Card, CardContent } from '@/components/Card'
import { SimpleInput } from '@/components/Inputs'
import { DEFAULT_ROLES } from '@/constants/client'
import { queryAtom } from '@/global/management-career'
import {
    rolesAtom,
    selectedRoleIdAtom,
    usersCountAtom,
} from '@/global/roles.globals'
import { PermissionsList } from './permissions-list'

export function RolesTable() {
    const [roles, setRoles] = useAtom(rolesAtom)
    const selectedRoleId = useAtomValue(selectedRoleIdAtom)
    const [query, setQuery] = useAtom(queryAtom)
    const selectRole = useSetAtom(selectedRoleIdAtom)
    const [usersCount, setUsersCount] = useAtom(usersCountAtom)

    useEffect(() => {
        getRoles().then(r => {
            setRoles(
                r.map(r => ({ ...r, permissions: r.permissions.toString() })),
            )
        })
        getUsersCountPerRole().then(r => {
            if (r.status === 'success') {
                setUsersCount(r.roles)
            }
        })
    }, [setRoles, setUsersCount])

    return (
        <>
            <div className='flex'>
                {/* Panel izquierdo - Lista de roles */}
                <div className='border-border bg-card w-1/3 border-r'>
                    <div className='border-border p-6'>
                        {/* Barra de búsqueda */}
                        <div className='relative'>
                            <SearchIcon className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                            <SimpleInput
                                placeholder='Buscar roles...'
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                className='pl-10'
                            />
                        </div>
                    </div>

                    {/* Lista de roles */}
                    <div className='space-y-2 overflow-y-auto p-6'>
                        {roles
                            .filter(role => role.name !== DEFAULT_ROLES.DELETED)
                            .filter(role =>
                                role.name
                                    .toLowerCase()
                                    .includes(query.toLowerCase()),
                            )
                            .map(role => (
                                <Card
                                    key={role.id}
                                    className={`cursor-pointer transition-all hover:shadow-md ${
                                        selectedRoleId === role.id ?
                                            'ring-primary bg-primary/5 ring-2'
                                        :   'hover:bg-muted/50'
                                    }`}
                                    onClick={() => selectRole(role.id)}
                                >
                                    <CardContent className='p-3'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex flex-1 items-center gap-2'>
                                                <h3 className='text-card-foreground mb-1 text-sm font-semibold'>
                                                    {role.name}
                                                </h3>
                                                <Badge
                                                    variant='secondary'
                                                    className='text-xs'
                                                >
                                                    {usersCount.find(
                                                        u => u.id === role.id,
                                                    )?.count ?? 0}{' '}
                                                    usuarios
                                                </Badge>
                                                {Object.values(DEFAULT_ROLES)
                                                    .map(r => r.toLowerCase())
                                                    .includes(
                                                        role.name.toLowerCase(),
                                                    ) && (
                                                    <Badge
                                                        variant='outline'
                                                        className='text-xs'
                                                    >
                                                        System
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </div>

                {/* Panel derecho - Permisos */}
                <PermissionsList />
            </div>
        </>
    )
}
