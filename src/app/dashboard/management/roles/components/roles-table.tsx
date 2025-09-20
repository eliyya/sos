'use client'

import { Button } from '@/components/Button'
import { Career, Role } from '@prisma/client'
import { STATUS } from '@prisma/client'
import { Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    editDialogAtom,
    openArchiveAtom,
    openDeleteAtom,
    openUnarchiveAtom,
    showArchivedAtom,
    entityToEditAtom,
    updateAtom,
    queryAtom,
} from '@/global/management-role'
import { getRoles } from '@/actions/roles'
import { Switch } from '@/components/Switch'
import { PermissionsBitField } from '@/bitfields/PermissionsBitField'
const AllPermissions = new PermissionsBitField(PermissionsBitField.getMask())

export function RolesTable() {
    const [roles, setRoles] = useState<Role[]>([])
    const update = useAtomValue(updateAtom)
    const archived = useAtomValue(showArchivedAtom)
    const q = useAtomValue(queryAtom)
    const [actual, setActual] = useState<Role | null>(null)

    useEffect(() => {
        getRoles().then(r => {
            setRoles(r)
            setActual(r[0])
        })
    }, [update])

    return (
        <>
            <div className='mx-auto grid grid-cols-10 gap-2 *:p-4'>
                <ul className='col-span-3 flex flex-col gap-1'>
                    {roles.map(role => (
                        <li
                            className='hover:bg-accent bg-accent/20 text-muted-foreground flex items-center gap-3 rounded-md px-4 py-2 text-sm'
                            key={role.id}
                        >
                            {role.name}
                        </li>
                    ))}
                </ul>
                <ul className='col-span-7 flex flex-col gap-2'>
                    {AllPermissions.entries().map(([p, v]) => (
                        <li
                            key={p}
                            className='flex items-center justify-between gap-2'
                        >
                            <div>{p}</div>
                            <Switch
                                checked={new PermissionsBitField(
                                    actual?.permissions ?? 0n,
                                ).has(v)}
                            />
                        </li>
                    ))}
                </ul>
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
