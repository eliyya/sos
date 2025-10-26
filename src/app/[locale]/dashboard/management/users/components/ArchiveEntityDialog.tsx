'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Archive, Ban } from 'lucide-react'
import { Activity, useState, useTransition } from 'react'
import { archiveUser } from '@/actions/users.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { entityToEditAtom, dialogOpenedAtom } from '@/global/users.globals'
import { useRoles } from '@/hooks/roles.hooks'
import { DEFAULT_ROLES } from '@/constants/client'
import { useUsers } from '@/hooks/users.hooks'
import { STATUS } from '@/prisma/generated/browser'

export function ArchiveEntityDialog() {
    const [open, setOpen] = useAtom(dialogOpenedAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const { roles } = useRoles()
    const adminRole = roles.find(r => r.name === DEFAULT_ROLES.ADMIN)
    const { setUsers } = useUsers()

    if (!entity || !adminRole) return null

    return (
        <Dialog
            open={open === 'archive'}
            onOpenChange={op => setOpen(op ? 'archive' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Archivar Usuario</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de archivar al usuario{' '}
                        <strong>{entity.name}</strong>?
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const id = data.get('id') as string
                            const response = await archiveUser(id)
                            if (response.status === 'error') {
                                if (
                                    response.type === 'not-allowed' &&
                                    response.message ===
                                        'Unique admin cannot be archived'
                                ) {
                                    setOpen('preventArchiveAdmin')
                                    return
                                }
                                setMessage(
                                    'Algo sucedio mal, intente nuevamente',
                                )
                                setTimeout(() => setMessage(''), 5_000)
                            } else {
                                setUsers(users =>
                                    users.map(u =>
                                        u.id !== id ?
                                            u
                                        :   { ...u, status: STATUS.ARCHIVED },
                                    ),
                                )
                                setOpen(null)
                            }
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <input type='hidden' value={entity.id} name='id' />
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
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
                            variant={'destructive'}
                            disabled={inTransition}
                        >
                            <Archive className='mr-2 h-5 w-5' />
                            Archivar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
