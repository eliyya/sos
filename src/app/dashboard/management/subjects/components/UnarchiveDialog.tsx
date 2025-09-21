'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ArchiveRestore, Ban } from 'lucide-react'
import { useState, useTransition } from 'react'
import { unarchiveSubject } from '@/actions/subjects'
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
} from '@/global/management-subjects'


export function UnarchiveDialog() {
    const [open, setOpen] = useAtom(openUnarchiveAtom)
    const [inTransition, startTransition] = useTransition()
    const user = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)

    if (!user) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Desarchivar Asignatura</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de desarchivar la asignatura {user.name}?
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await unarchiveSubject(data)
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
                    {message && (
                        <MessageError>{message}</MessageError>
                    )}
                    <input type='hidden' value={user.id} name='id' />
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
                            <ArchiveRestore className='mr-2 h-5 w-5' />
                            Desarchivar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
