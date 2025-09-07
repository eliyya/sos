'use client'

import { createMachine } from '@/actions/machines'
import { Button } from '@/components/Button'
import { CompletInput, CompletTextarea } from '@/components/Inputs'
import { openCreateAtom, updateAtom } from '@/global/managment-machines'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Dialog'
import { useAtom, useSetAtom } from 'jotai'
import { UserIcon, Save } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { CompletSelect } from '@/components/Select'
import { Laboratory } from '@prisma/client'
import { getActiveLaboratories } from '@/actions/laboratory'

export function CreateSubjectDialog() {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateAtom)
    const [laboratories, setLaboratories] = useState<Laboratory[]>([])

    useEffect(() => {
        getActiveLaboratories().then(labs => {
            setLaboratories(labs)
        })
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Máquina</DialogTitle>
                </DialogHeader>
                {/* <DialogDescription>
                    Edit the user&apos;s information
                </DialogDescription> */}
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await createMachine(data)
                            if (error) setMessage(error)
                            else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    500,
                                )
                                setOpen(false)
                            }
                            setTimeout(() => {
                                setMessage('')
                            }, 5_000)
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && (
                        <span className='animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md'>
                            {message}
                        </span>
                    )}
                    <CompletInput
                        required
                        label='Numero'
                        type='number'
                        name='number'
                        icon={UserIcon}
                    />
                    <CompletInput
                        required
                        label='Procesador'
                        type='text'
                        name='processor'
                        icon={UserIcon}
                    />
                    <CompletInput
                        required
                        label='RAM'
                        type='text'
                        name='ram'
                        icon={UserIcon}
                    />
                    <CompletInput
                        required
                        label='Almacenamiento'
                        type='text'
                        name='storage'
                        icon={UserIcon}
                    />
                    <CompletInput
                        required
                        label='Serie'
                        type='text'
                        name='serie'
                        icon={UserIcon}
                    />
                    <CompletTextarea
                        label='Descripcion'
                        name='description'
                        icon={UserIcon}
                    ></CompletTextarea>
                    <CompletSelect
                        label='Laboratorio Asignado'
                        name='laboratory_id'
                        options={laboratories.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                        icon={UserIcon}
                    />

                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Crear
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
