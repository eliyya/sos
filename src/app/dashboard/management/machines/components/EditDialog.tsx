'use client'

import { editMachine } from '@/actions/machines'
import { Button } from '@/components/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { RetornableCompletInput } from '@/components/Inputs'
import {
    editDialogAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/managment-machines'
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
                    <span className='text-3xl'>Editar Maquina</span>
                </DialogTitle>
                <DialogDescription>
                    Edita la Maquina{old.number}
                </DialogDescription>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await editMachine(data)
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
                        defaultValue={old.number}
                        required
                        label='Numero'
                        type='number'
                        name='number'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        defaultValue={old.processor}
                        required
                        label='Procesador'
                        type='text'
                        name='processor'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        defaultValue={old.ram}
                        required
                        label='Ram'
                        type='text'
                        name='ram'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        defaultValue={old.storage}
                        required
                        label='Almacenamiento'
                        type='text'
                        name='storage'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        defaultValue={old.serie ?? ''}
                        required
                        label='Serie'
                        type='text'
                        name='serie'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        defaultValue={old.description}
                        label='Descripcion'
                        name='description'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        defaultValue={old.laboratory_id ?? ''}
                        label='Laboratorio Asignado'
                        name='laboratory_id'
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
