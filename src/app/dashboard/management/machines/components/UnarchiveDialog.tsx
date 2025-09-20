'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Ban, MonitorCheckIcon } from 'lucide-react'
import { useState, useTransition } from 'react'

import { unarchiveMachine } from '@/actions/machines'
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
    openUnarchiveAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/management-machines'

export function UnarchiveDialog() {
    const [open, setOpen] = useAtom(openUnarchiveAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)

    if (!entity) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reactivar Máquina</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de reactivar la máquina {entity.number}?
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await unarchiveMachine(data)
                            if (error) {
                                setMessage(error)
                                setTimeout(() => setMessage('error'), 5_000)
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
                            variant={'secondary'}
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
                            variant={'default'}
                            disabled={inTransition}
                        >
                            <MonitorCheckIcon className='mr-2 h-5 w-5' />
                            Reactivar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
