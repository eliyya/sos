'use client'

import { useSetAtom } from 'jotai'
import { Plus, PlusIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { createNewRole } from '@/actions/roles.actions'
import { Button } from '@/components/Button'
import { selectedRoleIdAtom } from '@/global/roles.globals'
import { useRoles } from '@/hooks/roles.hooks'
import { Toast, ToastDescription, ToastTitle } from '@/components/Toast'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

export function CreateButton() {
    const { setRoles } = useRoles()
    const [inTransition, startTransition] = useTransition()
    const setSelectedRoleId = useSetAtom(selectedRoleIdAtom)
    const router = useRouter()
    const [toastInfo, setToastInfo] = useState<{
        title: string
        description: string
    } | null>(null)

    const onClick = async () =>
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
                    return setToastInfo({
                        title: 'Acceso denegado',
                        description:
                            'No tienes permiso para realizar esta acción.',
                    })
                }
                if (response.type === 'unexpected') {
                    console.log(response)
                    return setToastInfo({
                        title: 'Ha ocurrido un error',
                        description: 'Por favor, intenta de nuevo más tarde.',
                    })
                }
            }
        })

    return (
        <>
            <Button onClick={onClick} disabled={inTransition}>
                <PlusIcon className='mr-3' />
                Crear Rol
            </Button>
            <Toast
                variant='destructive'
                open={toastInfo !== null}
                onOpenChange={v => {
                    if (!v) setToastInfo(null)
                }}
            >
                <ToastTitle>{toastInfo?.title}</ToastTitle>
                <ToastDescription>{toastInfo?.description}</ToastDescription>
            </Toast>
        </>
    )
}
