'use client'

import { archiveUser } from '@/actions/users'
import { Button } from '@/components/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import {
    openArchiveUserAtom,
    updateUsersAtom,
    userToEditAtom,
} from '@/global/management-users'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Archive, Ban } from 'lucide-react'
import { useState, useTransition } from 'react'

export function ArchiveEntityDialog() {
    const [open, setOpen] = useAtom(openArchiveUserAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(userToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateUsersAtom)

    if (!entity) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>
                        Archivar @{entity.username}
                    </span>
                </DialogTitle>
                <DialogDescription>
                    ¿Está seguro de archivar{' '}
                    <span className='font-bold'>{entity.name}</span>?
                </DialogDescription>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await archiveUser(data)
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
                    {message && (
                        <span className='animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md'>
                            {message}
                        </span>
                    )}
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
