'use client'

import { useSetAtom } from 'jotai'
import { PlusIcon } from 'lucide-react'
import { useTransition } from 'react'
import { createNewRole } from '@/actions/roles.actions'
import { Button } from '@/components/ui/button'
import { selectedRoleIdAtom } from '@/global/management.globals'
import { useRoles } from '@/hooks/roles.hooks'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { toast } from 'sonner'
import { toastGenericError } from '@/components/ui/sonner'

export function CreateButton() {
    const { setRoles } = useRoles()
    const [inTransition, startTransition] = useTransition()
    const setSelectedRoleId = useSetAtom(selectedRoleIdAtom)
    const router = useRouter()

    const onClick = async () =>
        startTransition(async () => {
            const response = await createNewRole()
            if (response.status === 'success') {
                setRoles(prev => [
                    ...prev,
                    {
                        id: response.role.id,
                        name: response.role.name,
                        permissions: response.role.permissions,
                    },
                ])
                setSelectedRoleId(response.role.id)
            } else {
                if (response.type === 'unauthorized') {
                    return router.push(app.$locale.auth.login('es'))
                }
                if (response.type === 'permission') {
                    toast.error('Acceso denegado', {
                        description:
                            'No tienes permiso para realizar esta acción.',
                    })
                    return
                }
                if (response.type === 'unexpected') {
                    console.log(response)
                    toastGenericError()
                    return
                }
            }
        })

    return (
        <>
            <Button onClick={onClick} disabled={inTransition}>
                <PlusIcon className='mr-3' />
                Crear Rol
            </Button>
        </>
    )
}
