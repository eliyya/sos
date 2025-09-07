'use client'

import { adminCount, deleteUser } from '@/actions/users'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import {
    openDeleteAtom,
    updateAtom,
    entityToEditAtom,
    openPreventArchiveAdminAtom,
    adminRoleAtom,
} from '@/global/management-users'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Ban, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'

export function DeleteEntityDialog() {
    const [open, setOpen] = useAtom(openDeleteAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)
    const setOpenPreventArchiveAdmin = useSetAtom(openPreventArchiveAdminAtom)
    const adminRole = useAtomValue(adminRoleAtom)

    if (!entity || !adminRole) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar Usuario</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de eliminar el usuario{' '}
                        <span className='font-bold'>{entity.name}</span>?
                        <span>Esta acción es irreversible</span>
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
                    {message && (
                        <span className='animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md'>
                            {message}
                        </span>
                    )}
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
