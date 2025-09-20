'use client'

import { Role } from '@prisma/client'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    openDeleteAtom,
    rolesAtom,
    selectedRoleIdAtom,
    updateAtom,
} from '@/global/management-roles'
import { getRoles } from '@/actions/roles'
import { SimpleInput } from '@/components/Inputs'
import { Card, CardContent } from '@/components/Card'
import { Badge } from '@/components/Badge'
import { queryAtom } from '@/global/management-career'
import { PermissionsList } from './permissions-list'

export function RolesTable() {
    const [roles, setRoles] = useAtom(rolesAtom)
    const update = useAtomValue(updateAtom)
    const selectedRoleId = useAtomValue(selectedRoleIdAtom)
    const [query, setQuery] = useAtom(queryAtom)
    const selectRole = useSetAtom(selectedRoleIdAtom)

    useEffect(() => {
        getRoles().then(r => {
            setRoles(
                r.map(r => ({ ...r, permissions: r.permissions.toString() })),
            )
        })
    }, [setRoles])

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
                                            <div className='flex-1'>
                                                <h3 className='text-card-foreground mb-1 text-sm font-semibold'>
                                                    {role.name}
                                                </h3>
                                                <Badge
                                                    variant='secondary'
                                                    className='text-xs'
                                                >
                                                    {0} usuarios
                                                </Badge>
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
