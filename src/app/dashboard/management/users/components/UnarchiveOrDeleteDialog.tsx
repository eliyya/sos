'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ArchiveRestoreIcon, BanIcon, TrashIcon } from 'lucide-react'
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
import {
    entityToEditAtom,
    updateAtom,
    openUnarchiveOrDeleteAtom,
    openDeleteAtom,
} from '@/global/management-users'

export function UnarchiveOrDeleteDialog() {
    const [open, setOpen] = useAtom(openUnarchiveOrDeleteAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)
    const setOpenDelete = useSetAtom(openDeleteAtom)

    if (!entity) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Usuario archivado</DialogTitle>
                    <DialogDescription>
                        El usuario {entity.name} está archivado. ¿Qué desea
                        hacer con él? <strong>{entity.name}</strong>?
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
                            type='button'
                            variant='secondary'
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                setOpen(false)
                            }}
                        >
                            <BanIcon className='mr-2 h-5 w-5' />
                            Cancelar
                        </Button>
                        <Button
                            type='submit'
                            variant='default'
                            disabled={inTransition}
                        >
                            <ArchiveRestoreIcon className='mr-2 h-5 w-5' />
                            Desarchivar
                        </Button>
                        <Button
                            type='button'
                            variant='destructive'
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                setOpen(false)
                                setOpenDelete(true)
                            }}
                        >
                            <TrashIcon className='mr-2 h-5 w-5' />
                            Eliminar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
