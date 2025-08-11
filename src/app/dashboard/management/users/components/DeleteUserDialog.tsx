'use client'

import { getUserRole } from '@/actions/roles'
import { deleteUser } from '@/actions/users'
import { Button } from '@/components/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import {
    openDeleteUserAtom,
    updateUsersAtom,
    userToEditAtom,
} from '@/global/management-users'
import { authClient } from '@/lib/auth-client'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Ban, Trash2 } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'

export function DeleteUserDialog() {
    const [open, setOpen] = useAtom(openDeleteUserAtom)
    const [inTransition, startTransition] = useTransition()
    const user = useAtomValue(userToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateUsersAtom)
    const [userRoleId, setUserRoleId] = useState('')

    useEffect(() => {
        startTransition(async () => {
            const userRole = await getUserRole()
            setUserRoleId(userRole.id)
        })
    }, [])

    if (!user) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Delete @{user.username}</span>
                </DialogTitle>
                <DialogDescription>
                    ¿Está seguro de eliminar a {user.name}?{' '}
                    <span>Esta acción es irreversible</span>
                </DialogDescription>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await deleteUser(data)
                            if (error) {
                                setMessage(
                                    'Algo sucedio mal, intente nuevamente',
                                )
                                setTimeout(() => setMessage(''), 5_000)
                            } else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    1_000,
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
                    <input type='hidden' value={user.id} name='user_id' />
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
