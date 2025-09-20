'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import { ShieldIcon, Trash2Icon } from 'lucide-react'

import { PermissionsBitField } from '@/bitfields/PermissionsBitField'
import { Button } from '@/components/Button'
import { Switch } from '@/components/Switch'
import { openDeleteAtom, selectedRoleAtom } from '@/global/management-roles'

import { RoleName } from './role-name'

const AllPermissions = new PermissionsBitField(PermissionsBitField.getMask())

export function PermissionsList() {
    const openDeleteDialog = useSetAtom(openDeleteAtom)
    const selected = useAtomValue(selectedRoleAtom)

    if (!selected) return null

    return (
        <div className='bg-background flex-1'>
            <div className='border-border flex justify-between p-6'>
                <div className='flex items-center gap-3'>
                    <ShieldIcon className='text-primary h-6 w-6' />
                    <RoleName />
                </div>
                <Button size='icon' onClick={() => openDeleteDialog(true)}>
                    <Trash2Icon className='w-xs text-xs' />
                </Button>
            </div>

            <div className='overflow-y-auto p-6'>
                <div className='space-y-2'>
                    {AllPermissions.entries().map(([permission, value]) => (
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
                                    selected.permissions,
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
                    ))}
                </div>
            </div>
        </div>
    )
}
