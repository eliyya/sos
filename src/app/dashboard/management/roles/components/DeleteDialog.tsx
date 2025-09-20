'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Ban, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'

import { deleteRole } from '@/actions/roles'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import {
    openDeleteAtom,
    rolesAtom,
    selectedRoleAtom,
} from '@/global/management-roles'

export function DeleteDialog() {
    const [open, setOpen] = useAtom(openDeleteAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedRoleAtom)
    const [message, setMessage] = useState('')
    const setRoles = useSetAtom(rolesAtom)

    if (!entity) return null

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
                    action={() => {
                        startTransition(async () => {
                            const response = await deleteRole(entity.id)
                            if (response.status === 'error') {
                                setMessage('Algo salio mal, intente de nuevo')
                                setTimeout(() => setMessage(''), 5_000)
                            } else {
                                setRoles(prev =>
                                    prev.filter(role => role.id !== entity.id),
                                )
                                setOpen(false)
                            }
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && <MessageError>{message}</MessageError>}
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
