'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Archive, Ban } from 'lucide-react'
import { useState, useTransition } from 'react'
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
import {
    openArchiveUserAtom,
    updateAtom,
    entityToEditAtom,
    openPreventArchiveAdminAtom,
} from '@/global/management-users'
import { useRoles } from '@/hooks/roles.hooks'
import { DEFAULT_ROLES } from '@/constants/client'

export function ArchiveEntityDialog() {
    const [open, setOpen] = useAtom(openArchiveUserAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)
    const setOpenPreventArchiveAdmin = useSetAtom(openPreventArchiveAdminAtom)
    const { roles } = useRoles()
    const adminRole = roles.find(r => r.name === DEFAULT_ROLES.ADMIN)

    if (!entity || !adminRole) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                                    setOpenPreventArchiveAdmin(true)
                                    setOpen(false)
                                    return
                                }
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
                    <input type='hidden' value={entity.id} name='id' />
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
                            <Archive className='mr-2 h-5 w-5' />
                            Archivar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
