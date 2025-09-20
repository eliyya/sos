'use client'

import { Button } from '@/components/Button'
import { Career, Role } from '@prisma/client'
import { STATUS } from '@prisma/client'
import {
    Archive,
    ArchiveRestore,
    Pencil,
    SearchIcon,
    ShieldIcon,
    Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    editDialogAtom,
    openArchiveAtom,
    openDeleteAtom,
    openUnarchiveAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/management-role'
import { getRoles } from '@/actions/roles'
import { Switch } from '@/components/Switch'
import { PermissionsBitField } from '@/bitfields/PermissionsBitField'
import { SimpleInput } from '@/components/Inputs'
import { Card, CardContent } from '@/components/Card'
import { Badge } from '@/components/Badge'
const AllPermissions = new PermissionsBitField(PermissionsBitField.getMask())

export function RolesTable() {
    const [searchTerm, setSearchTerm] = useState('')
    const [roles, setRoles] = useState<Role[]>([])
    const update = useAtomValue(updateAtom)
    const [actual, setActual] = useState<Role | null>(null)
    const openDeleteDialog = useSetAtom(openDeleteAtom)

    useEffect(() => {
        getRoles().then(r => {
            setRoles(r)
            setActual(r[0])
        })
    }, [update])

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
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className='pl-10'
                            />
                        </div>
                    </div>

                    {/* Lista de roles */}
                    <div className='space-y-2 overflow-y-auto p-6'>
                        {roles.map(role => (
                            <Card
                                key={role.id}
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                    actual?.id === role.id ?
                                        'ring-primary bg-primary/5 ring-2'
                                    :   'hover:bg-muted/50'
                                }`}
                                onClick={() => setActual(role)}
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
                <div className='bg-background flex-1'>
                    <div className='border-border flex justify-between p-6'>
                        <div className='flex items-center gap-3'>
                            <ShieldIcon className='text-primary h-6 w-6' />
                            <div>
                                <h2 className='text-foreground text-xl font-bold'>
                                    Permisos para {actual?.name}
                                </h2>
                            </div>
                        </div>
                        <Button
                            size='icon'
                            onClick={() => openDeleteDialog(true)}
                        >
                            <Trash2 className='w-xs text-xs' />
                        </Button>
                    </div>

                    <div className='overflow-y-auto p-6'>
                        <div className='space-y-2'>
                            {AllPermissions.entries().map(
                                ([permission, value]) => (
                                    <div
                                        key={permission}
                                        className='border-border hover:bg-muted/30 flex items-center justify-between rounded-lg border p-3 transition-colors'
                                    >
                                        <div className='flex-1'>
                                            <h4 className='text-card-foreground mb-1 font-medium'>
                                                {permission}
                                            </h4>
                                            <p className='text-muted-foreground text-sm'>
                                                {permission}
                                            </p>
                                        </div>
                                        <Switch
                                            checked={new PermissionsBitField(
                                                actual?.permissions,
                                            ).has(value)}
                                            // onCheckedChange={enabled =>
                                            //     handlePermissionToggle(
                                            //         permission.id,
                                            //         enabled,
                                            //     )
                                            // }
                                            className='ml-4'
                                        />
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

interface ButtonsProps {
    entity: Career
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
