'use client'

import { useSetAtom } from 'jotai'
import { PlusIcon } from 'lucide-react'
import { useTransition } from 'react'
import { createNewRole } from '@/actions/roles.actions'
import { Button } from '@/components/Button'
import { selectedRoleIdAtom } from '@/global/roles.globals'
import { useRoles } from '@/hooks/roles.hooks'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { useToast } from '@/hooks/toast.hooks'

export function CreateButton() {
    const { setRoles } = useRoles()
    const [inTransition, startTransition] = useTransition()
    const setSelectedRoleId = useSetAtom(selectedRoleIdAtom)
    const router = useRouter()
    const { openToast, Toast } = useToast()

    const onClick = async () => {
        openToast({
            title: 'Creando rol...',
            description: 'Por favor, espera mientras se crea el rol.',
        })
        startTransition(async () => {
            const response = await createNewRole()
            if (response.status === 'success') {
                setRoles(prev => [
                    ...prev,
                    {
                        id: response.role.id,
                        name: response.role.name,
                        permissions: response.role.permissions.toString(),
                    },
                ])
                setSelectedRoleId(response.role.id)
            } else {
                if (response.type === 'unauthorized') {
                    return router.push(app.auth.login())
                }
                if (response.type === 'permission') {
                    return openToast({
                        title: 'Acceso denegado',
                        variant: 'destructive',
                        description:
                            'No tienes permiso para realizar esta acción.',
                    })
                }
                if (response.type === 'unexpected') {
                    console.log(response)
                    return openToast({
                        title: 'Ha ocurrido un error',
                        variant: 'destructive',
                        description: 'Por favor, intenta de nuevo más tarde.',
                    })
                }
            }
        })
    }

    return (
        <>
            <Button onClick={onClick} disabled={inTransition}>
                <PlusIcon className='mr-3' />
                Crear Rol
            </Button>
            <Toast />
        </>
    )
}
