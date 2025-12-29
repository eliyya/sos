import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useTransition } from 'react'
import { PermissionsBitField } from '@/bitfields/PermissionsBitField'
import { Button } from '@/components/Button'
import { DEFAULT_ROLES } from '@/constants/client'
import {
    permissionsEditedAtom,
    selectedRoleAtom,
} from '@/global/management.globals'
import { useRoles } from '@/hooks/roles.hooks'
import { changuePermissions } from '@/actions/roles.actions'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

export function SaveButton() {
    const selectedRole = useAtomValue(selectedRoleAtom)
    const [isPending, startTransition] = useTransition()
    const { setRoles } = useRoles()
    const [permissionsEdited, setPermissionsEdited] = useAtom(
        permissionsEditedAtom,
    )
    const router = useRouter()

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
            } else {
                if (response.type === 'not-found') {
                    toast.error('Error', {
                        description: 'El rol no se encontro',
                    })
                } else if (response.type === 'permission') {
                    toast.error('Error', {
                        description: 'No tienes permiso para editar este rol',
                    })
                } else if (response.type === 'invalid-input') {
                    toast.error('Error', {
                        description:
                            'El rol es administrado por el sistema, no se puede editar',
                    })
                } else if (response.type === 'unexpected') {
                    toast.error('Error', {
                        description: 'Algo salio mal, intente de nuevo',
                    })
                } else if (response.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                }
            }
        })
    }

    return (
        <>
            <Button
                type='submit'
                className={cn('', {
                    hidden: permissionsEdited.equals(
                        new PermissionsBitField(
                            selectedRole?.permissions ?? 0n,
                        ),
                    ),
                })}
                size='sm'
                disabled={
                    isPending ||
                    selectedRole?.name === DEFAULT_ROLES.ADMIN ||
                    permissionsEdited.equals(
                        new PermissionsBitField(
                            selectedRole?.permissions ?? 0n,
                        ),
                    )
                }
                onClick={handleSave}
            >
                Guardar cambios
            </Button>
            <Button
                variant='outline'
                size='sm'
                disabled={isPending}
                className={cn('', {
                    hidden: permissionsEdited.equals(
                        new PermissionsBitField(
                            selectedRole?.permissions ?? 0n,
                        ),
                    ),
                })}
                onClick={() =>
                    setPermissionsEdited(
                        new PermissionsBitField(selectedRole?.permissions),
                    )
                }
            >
                Restaurar
            </Button>
        </>
    )
}
