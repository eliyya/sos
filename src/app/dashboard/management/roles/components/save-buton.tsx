import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useTransition } from 'react'

import { changuePermissions } from '@/actions/roles'
import { PermissionsBitField } from '@/bitfields/PermissionsBitField'
import { Button } from '@/components/Button'
import {
    permissionsEditedAtom,
    rolesAtom,
    selectedRoleAtom,
} from '@/global/management-roles'
import { cn } from '@/lib/utils'

export function SaveButton() {
    const selectedRole = useAtomValue(selectedRoleAtom)
    const [isPending, startTransition] = useTransition()
    const setRoles = useSetAtom(rolesAtom)
    const [permissionsEdited, setPermissionsEdited] = useAtom(
        permissionsEditedAtom,
    )

    useEffect(() => {
        if (selectedRole) {
            setPermissionsEdited(
                new PermissionsBitField(selectedRole.permissions),
            )
        }
    }, [selectedRole, setPermissionsEdited])

    const handleSave = () => {
        startTransition(async () => {
            if (!selectedRole) return
            const response = await changuePermissions(
                selectedRole.id,
                permissionsEdited.bitfield,
            )
            if (response.status === 'success') {
                setRoles(prev =>
                    prev.map(r =>
                        r.id === selectedRole.id ?
                            {
                                ...r,
                                permissions:
                                    response.role.permissions.toString(),
                            }
                        :   r,
                    ),
                )
                return setPermissionsEdited(
                    new PermissionsBitField(response.role.permissions),
                )
            }
        })
    }

    return (
        <Button
            type='submit'
            className={cn('', {
                hidden: permissionsEdited.equals(
                    new PermissionsBitField(selectedRole?.permissions ?? 0n),
                ),
            })}
            size='sm'
            disabled={
                isPending ||
                permissionsEdited.equals(
                    new PermissionsBitField(selectedRole?.permissions ?? 0n),
                )
            }
            onClick={handleSave}
        >
            Guardar cambios
        </Button>
    )
}
