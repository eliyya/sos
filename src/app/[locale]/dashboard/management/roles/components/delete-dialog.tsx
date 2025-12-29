'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Ban, Trash2 } from 'lucide-react'
import { Activity, useState, useTransition } from 'react'
import { deleteRole } from '@/actions/roles.actions'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { openDeleteAtom, selectedRoleAtom } from '@/global/management.globals'
import { useRoles } from '@/hooks/roles.hooks'
import app from '@eliyya/type-routes'
import { useRouter } from 'next/navigation'

export function DeleteDialog() {
    const [open, setOpen] = useAtom(openDeleteAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedRoleAtom)
    const [message, setMessage] = useState('')
    const { setRoles } = useRoles()
    const router = useRouter()

    if (!entity) return

    const handleDelete = () => {
        startTransition(async () => {
            const response = await deleteRole(entity.id)
            if (response.status === 'error') {
                if (response.type === 'not-found') {
                    setMessage('El rol no se encontro')
                } else if (response.type === 'permission') {
                    setMessage('No tienes permiso para eliminar este rol')
                } else if (response.type === 'invalid-input') {
                    setMessage(
                        'El rol es administrado por el sistema, no se puede eliminar',
                    )
                } else if (response.type === 'unexpected') {
                    setMessage('Algo salio mal, intente de nuevo')
                } else if (response.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                }
                setTimeout(() => setMessage(''), 5_000)
            } else {
                setRoles(prev => prev.filter(role => role.id !== entity.id))
                setOpen(false)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar Rol</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de eliminar el rol{' '}
                        <strong>{entity.name}</strong>? todos los usuarios con
                        este rol serán asignados al rol User.
                        <strong>Esta acción es irreversible</strong>
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={handleDelete}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                setOpen(false)
                            }}
                        >
                            <Ban className='mr-2 h-5 w-5' />
                            Cancelar
                        </Button>
                        <Button
                            type='submit'
                            variant={'destructive'}
                            disabled={inTransition}
                        >
                            <Trash2 className='mr-2 h-5 w-5' />
                            Eliminar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
