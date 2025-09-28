import { useAtom, useAtomValue } from 'jotai'
import { useEffect, useTransition } from 'react'
import { PermissionsBitField } from '@/bitfields/PermissionsBitField'
import { Button } from '@/components/Button'
import { DEFAULT_ROLES } from '@/constants/client'
import { permissionsEditedAtom, selectedRoleAtom } from '@/global/roles.globals'
import { useRoles } from '@/hooks/roles.hooks'
import { changuePermissions } from '@/actions/roles.actions'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/toast.hooks'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

export function SaveButton() {
    const selectedRole = useAtomValue(selectedRoleAtom)
    const [isPending, startTransition] = useTransition()
    const { setRoles } = useRoles()
    const [permissionsEdited, setPermissionsEdited] = useAtom(
        permissionsEditedAtom,
    )
    const { Toast, openToast } = useToast()
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
                    openToast({
                        title: 'Error',
                        description: 'El rol no se encontro',
                        variant: 'destructive',
                    })
                } else if (response.type === 'permission') {
                    openToast({
                        title: 'Error',
                        description: 'No tienes permiso para editar este rol',
                        variant: 'destructive',
                    })
                } else if (response.type === 'invalid-input') {
                    openToast({
                        title: 'Error',
                        description:
                            'El rol es administrado por el sistema, no se puede editar',
                        variant: 'destructive',
                    })
                } else if (response.type === 'unexpected') {
                    openToast({
                        title: 'Error',
                        description: 'Algo salio mal, intente de nuevo',
                        variant: 'destructive',
                    })
                } else if (response.type === 'unauthorized') {
                    router.replace(app.auth.login())
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
            <Toast />
        </>
    )
}
