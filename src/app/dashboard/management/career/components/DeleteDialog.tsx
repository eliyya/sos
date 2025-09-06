'use client'

import { deleteCareer } from '@/actions/career'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from '@/components/Dialog'
import {
    openDeleteAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/managment-career'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Ban, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'

export function DeleteDialog() {
    const [open, setOpen] = useAtom(openDeleteAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)

    if (!entity) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Eliminar Carrera</span>
                </DialogTitle>
                <DialogDescription>
                    ¿Está seguro de eliminar{' '}
                    <span className='font-bold'>{entity.name}</span>?
                    <span>Esta acción es irreversible</span>
                </DialogDescription>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await deleteCareer(data)
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
                            <Trash2 className='mr-2 h-5 w-5' />
                            Eliminar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
