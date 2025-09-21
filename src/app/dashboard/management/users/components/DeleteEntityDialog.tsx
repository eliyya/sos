'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Ban, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { adminCount, deleteUser } from '@/actions/users'
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
    updateAtom,
    entityToEditAtom,
    openPreventArchiveAdminAtom,
} from '@/global/management-users'
import { rolesAtom } from '@/global/roles.globals'
import { DEFAULT_ROLES } from '@/constants/client'

export function DeleteEntityDialog() {
    const [open, setOpen] = useAtom(openDeleteAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)
    const setOpenPreventArchiveAdmin = useSetAtom(openPreventArchiveAdminAtom)
    const roles = useAtomValue(rolesAtom)
    const adminRole = roles.find(r => r.name === DEFAULT_ROLES.ADMIN)

    if (!entity || !adminRole) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar Usuario</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de eliminar el usuario{' '}
                        <strong>{entity.name}</strong>?
                        <strong>Esta acción es irreversible</strong>
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            if (entity.role_id === adminRole.id) {
                                const ac = await adminCount()
                                if (ac < 2) {
                                    setOpenPreventArchiveAdmin(true)
                                    setOpen(false)
                                    return
                                }
                            }
                            const { error } = await deleteUser(data)
                            if (error) {
                                setMessage(
                                    'Algo sucedio mal, intente nuevamente',
                                )
                                setTimeout(() => setMessage(''), 5_000)
                            } else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    500,
                                )
                                setOpen(false)
                            }
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && <MessageError>{message}</MessageError>}
                    <input type='hidden' value={entity.id} name='user_id' />
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
