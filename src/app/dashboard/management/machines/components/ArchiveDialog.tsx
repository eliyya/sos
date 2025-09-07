'use client'

import { archiveMachine } from '@/actions/machines'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/Dialog'
import {
    openArchiveAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/managment-machines'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Archive, Ban } from 'lucide-react'
import { useState, useTransition } from 'react'

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
                <DialogTitle>
                    <span className='text-3xl'>Archivar Estudiante</span>
                </DialogTitle>
                <DialogDescription>
                    ¿Está seguro de archivar{' '}
                    <span className='font-bold'>
                        {entity.number} {entity.number}
                    </span>
                    ?
                </DialogDescription>
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
