import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useTransition } from 'react'
import { PermissionsBitField } from '@/bitfields/PermissionsBitField'
import { Button } from '@/components/Button'
import { DEFAULT_ROLES } from '@/constants/client'
import { permissionsEditedAtom, selectedRoleAtom } from '@/global/roles.globals'
import { useRoles } from '@/hooks/roles.hooks'
import { changuePermissions } from '@/actions/roles.actions'
import { cn } from '@/lib/utils'

export function SaveButton() {
    const selectedRole = useAtomValue(selectedRoleAtom)
    const [isPending, startTransition] = useTransition()
    const { setRoles } = useRoles()
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
                                permissions: response.role.permissions,
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
                selectedRole?.name === DEFAULT_ROLES.ADMIN ||
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
