'use client'

import { createMachine } from '@/actions/machines'
import { Button } from '@/components/Button'
import { CompletInput, CompletTextarea } from '@/components/Inputs'
import {
    entityToEditAtom,
    openCreateAtom,
    openUnarchiveOrDeleteAtom,
    updateAtom,
} from '@/global/management-machines'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { useAtom, useSetAtom } from 'jotai'
import { UserIcon, Save } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { MessageError } from '@/components/Error'
import { CompletSelect } from '@/components/Select'
import { Laboratory } from '@prisma/client'
import { getActiveLaboratories } from '@/actions/laboratory'
import { map, mapError } from '@/lib/error'

export function CreateSubjectDialog() {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateAtom)
    const [laboratories, setLaboratories] = useState<Laboratory[]>([])
    const setOpenUnarchiveOrDelete = useSetAtom(openUnarchiveOrDeleteAtom)
    const setEntityToEdit = useSetAtom(entityToEditAtom)

    useEffect(() => {
        getActiveLaboratories().then(setLaboratories)
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
                    action={formData => {
                        startTransition(async () => {
                            const result = await createMachine(formData)
                            map(result, () => {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    500,
                                )
                                setOpen(false)
                            })
                            mapError(result, error => {
                                switch (error.message) {
                                    case 'La maquina se encuentra fuera de servicio':
                                        setOpen(false)
                                        setOpenUnarchiveOrDelete(true)
                                        setEntityToEdit(error.machine)
                                        break
                                    case 'La maquina ya existe':
                                        setMessage(error.message)
                                        break
                                    default:
                                        setMessage(error.message)
                                        break
                                }
                            })

                            setTimeout(() => setMessage(''), 5000)
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && <MessageError>{message}</MessageError>}
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
