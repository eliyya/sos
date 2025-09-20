'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ShieldIcon, Trash2Icon } from 'lucide-react'
import {
    PermissionsBitField,
    PermissionsFlags,
} from '@/bitfields/PermissionsBitField'
import { Button } from '@/components/Button'
import { Switch } from '@/components/Switch'
import { DEFAULT_ROLES } from '@/constants/client'
import {
    openDeleteAtom,
    permissionsEditedAtom,
    selectedRoleAtom,
} from '@/global/management-roles'
import { RoleName } from './role-name'
import { SaveButton } from './save-buton'

const AllPermissions = new PermissionsBitField(PermissionsBitField.getMask())

export function PermissionsList() {
    const openDeleteDialog = useSetAtom(openDeleteAtom)
    const selected = useAtomValue(selectedRoleAtom)
    const [permissionsEdited, setPermissionsEdited] = useAtom(
        permissionsEditedAtom,
    )

    const onCheckedChange = (
        permission: keyof typeof PermissionsFlags,
        enabled: boolean,
    ) => {
        if (enabled) {
            setPermissionsEdited(permissionsEdited.with(permission))
        } else {
            setPermissionsEdited(permissionsEdited.without(permission))
        }
    }

    if (!selected) return null

    return (
        <div className='bg-background flex-1'>
            <div className='border-border flex justify-between p-6'>
                <div className='flex items-center gap-3'>
                    <ShieldIcon className='text-primary h-6 w-6' />
                    <RoleName />
                </div>
                <div className='flex items-center gap-8'>
                    <SaveButton />
                    <Button
                        variant='destructive'
                        size='sm'
                        disabled={Object.values(DEFAULT_ROLES)
                            .map(r => r.toLowerCase())
                            .includes(selected.name.toLowerCase())}
                        onClick={() => openDeleteDialog(true)}
                    >
                        <Trash2Icon />
                    </Button>
                </div>
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
                                disabled={
                                    selected?.name === DEFAULT_ROLES.ADMIN
                                }
                                checked={permissionsEdited.has(value)}
                                onCheckedChange={checked =>
                                    onCheckedChange(permission, checked)
                                }
                                className='ml-4'
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
