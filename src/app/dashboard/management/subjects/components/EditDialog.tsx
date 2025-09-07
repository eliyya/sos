'use client'

import { editSubject } from '@/actions/subjects'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { RetornableCompletInput } from '@/components/Inputs'
import {
    openEditDialogAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/management-subjects'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Save, User } from 'lucide-react'
import { useState, useTransition } from 'react'
import { MessageError } from '@/components/Error'

export function EditDialog() {
    const [open, setOpen] = useAtom(openEditDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)

    if (!old) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Asignatura</DialogTitle>
                    <DialogDescription>
                        Edita la asignatura {old.name}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await editSubject(data)
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
                        <MessageError>{message}</MessageError>
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
                    <div className='flex w-full gap-4'>
                        <RetornableCompletInput
                            required
                            label='Horas de Teoria'
                            type='number'
                            name='theory_hours'
                            min={0}
                            originalValue={old.theory_hours.toString()}
                            icon={User}
                        ></RetornableCompletInput>
                        <RetornableCompletInput
                            required
                            label='Horas de práctica'
                            type='number'
                            name='practice_hours'
                            min={0}
                            originalValue={old.practice_hours.toString()}
                            icon={User}
                        ></RetornableCompletInput>
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
