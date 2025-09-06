'use client'

import { editCareer } from '@/actions/career'
import { Button } from '@/components/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { RetornableCompletInput } from '@/components/Inputs'
import {
    editDialogAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/managment-career'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Save, User } from 'lucide-react'
import { useState, useTransition } from 'react'

export function EditDialog() {
    const [open, setOpen] = useAtom(editDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)

    if (!old) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Editar Carrera</span>
                </DialogTitle>
                <DialogDescription>
                    Edita la carrera {old.name}
                </DialogDescription>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await editCareer(data)
                            if (error) setMessage(error)
                            else {
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
                    <input type='hidden' value={old.id} name='id' />
                    <RetornableCompletInput
                        originalValue={old.name}
                        required
                        label='Name'
                        type='text'
                        name='name'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={old.alias ?? ''}
                        required
                        label='Alias'
                        type='text'
                        name='alias'
                        icon={User}
                    ></RetornableCompletInput>
                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
