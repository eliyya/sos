'use client'

import { editMachine } from '@/actions/machines'
import { Button } from '@/components/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { RetornableCompletInput } from '@/components/Inputs'
import { RetornableCompletSelect } from '@/components/Select'
import {
    editDialogAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/managment-machines'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Save, User } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { findManyLaboratories } from '@/actions/laboratory'
import { STATUS } from '@prisma/client'

export function EditDialog() {
    const [open, setOpen] = useAtom(editDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)
    const [laboratories, setLaboratories] = useState<
        {
            id: string
            name: string
        }[]
    >([])

    useEffect(() => {
        findManyLaboratories({ where: { status: STATUS.ACTIVE } }).then(
            laboratories => setLaboratories(laboratories),
        )
    }, [])

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
                            if (error) {
                                setMessage(error)
                                setTimeout(() => setMessage(''), 5_000)
                            } else {
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
                        originalValue={old.number}
                        required
                        label='Numero'
                        type='number'
                        name='number'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={old.processor}
                        required
                        label='Procesador'
                        type='text'
                        name='processor'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={old.ram}
                        required
                        label='Ram'
                        type='text'
                        name='ram'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={old.storage}
                        required
                        label='Almacenamiento'
                        type='text'
                        name='storage'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={old.serie ?? ''}
                        required
                        label='Serie'
                        type='text'
                        name='serie'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={old.description}
                        label='Descripcion'
                        name='description'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletSelect
                        isClearable
                        originalValue={
                            laboratories
                                .map(l => ({
                                    label: l.name,
                                    value: l.id,
                                }))
                                .find(l => l.value === old.laboratory_id) ??
                            null
                        }
                        label='Laboratorio Asignado'
                        options={laboratories.map(l => ({
                            label: l.name,
                            value: l.id,
                        }))}
                        name='laboratory_id'
                        icon={User}
                    ></RetornableCompletSelect>
                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
