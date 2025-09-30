'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArchiveRestore, Ban } from 'lucide-react'
import { useState, useTransition } from 'react'
import { unarchiveUser } from '@/actions/users.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { dialogOpenedAtom, entityToEditAtom } from '@/global/users.globals'
import { useUsers } from '@/hooks/users.hooks'
import { STATUS } from '@/prisma/enums'

export function UnarchiveEntityDialog() {
    const [open, setOpen] = useAtom(dialogOpenedAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const { setUsers } = useUsers()
    const [message, setMessage] = useState('')

    if (!entity) return null

    return (
        <Dialog
            open={open === 'unarchive'}
            onOpenChange={op => setOpen(op ? 'unarchive' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Desarchivar Usuario</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de desarchivar al usuario {entity.name}?
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const id = data.get('id') as string
                            const response = await unarchiveUser(id)
                            if (response.status === 'error') {
                                if (response.type === 'not-found') {
                                    setMessage(response.message)
                                } else {
                                    setMessage(
                                        'Algo sucedio mal, intente nuevamente',
                                    )
                                }
                                setTimeout(() => setMessage(''), 5_000)
                            } else {
                                setUsers(users =>
                                    users.map(user =>
                                        user.id === id ?
                                            { ...user, status: STATUS.ACTIVE }
                                        :   user,
                                    ),
                                )
                                setOpen(null)
                            }
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && <MessageError>{message}</MessageError>}
                    <input type='hidden' value={entity.id} name='id' />
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            variant={'secondary'}
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                setOpen(null)
                            }}
                        >
                            <Ban className='mr-2 h-5 w-5' />
                            Cancelar
                        </Button>
                        <Button
                            type='submit'
                            variant={'default'}
                            disabled={inTransition}
                        >
                            <ArchiveRestore className='mr-2 h-5 w-5' />
                            Desarchivar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
