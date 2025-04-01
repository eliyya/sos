'use client'

import { editSubject } from '@/actions/subjects'
import { Button } from '@/components/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { RetornableCompletInput } from '@/components/Inputs'
import {
    editDialogAtom,
    subjectToEditAtom,
    updateAtom,
} from '@/global/management-subjects'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Save, User } from 'lucide-react'
import { useState, useTransition } from 'react'

export function EditDialog() {
    const [open, setOpen] = useAtom(editDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(subjectToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)

    if (!old) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Editar Materia</span>
                </DialogTitle>
                <DialogDescription>
                    Edita la información de la materia {old.name}
                </DialogDescription>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await editSubject(data)
                            if (error) setMessage(error)
                            else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    1_000,
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
                        defaultValue={old.name}
                        required
                        label='Name'
                        type='text'
                        name='name'
                    >
                        <User className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </RetornableCompletInput>
                    <div className='flex w-full gap-4'>
                        <RetornableCompletInput
                            required
                            label='Horas de Teoria'
                            type='number'
                            name='theory_hours'
                            min={0}
                            defaultValue={old.theory_hours.toString()}
                        >
                            <User className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                        </RetornableCompletInput>
                        <RetornableCompletInput
                            required
                            label='Horas de práctica'
                            type='number'
                            name='practice_hours'
                            min={0}
                            defaultValue={old.practice_hours.toString()}
                        >
                            <User className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                        </RetornableCompletInput>
                    </div>
                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
