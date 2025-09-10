'use client'

import { archiveMachine } from '@/actions/machines'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import {
    openArchiveAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/management-machines'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Archive, Ban, MonitorCogIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { MessageError } from '@/components/Error'

export function ArchiveDialog() {
    const [open, setOpen] = useAtom(openArchiveAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)

    if (!entity) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Poner en mantenimiento</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de poner la máquina #{entity.number} con
                        serie {entity.serie} en mantenimiento?
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await archiveMachine(data)
                            if (error) {
                                setMessage(error)
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
                            <MonitorCogIcon className='mr-2 h-5 w-5' />
                            Poner en mantenimiento
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
