'use client'

import { createSubject, getSubjectByName } from '@/actions/subjects'
import { Button } from '@/components/Button'
import { CompletInput } from '@/components/Inputs'
import {
    entityToEditAtom,
    errorNameAtom,
    nameAtom,
    openCreateAtom,
    openUnarchiveOrDeleteAtom,
    updateAtom,
} from '@/global/management-subjects'
import {
    Dialog,
    DialogContent,
    // DialogDescription,
    DialogTitle,
} from '@/components/Dialog'
import { useAtom, useSetAtom } from 'jotai'
import { Save, SquarePenIcon, ClockFadingIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { STATUS } from '@prisma/client'

export function CreateSubjectDialog() {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateAtom)
    const setErrorName = useSetAtom(errorNameAtom)
    const setName = useSetAtom(nameAtom)
    const setOpenUnarchiveOrDelete = useSetAtom(openUnarchiveOrDeleteAtom)
    const setUserToEdit = useSetAtom(entityToEditAtom)

    return (
        <Dialog
            open={open}
            onOpenChange={open => {
                setOpen(open)
                if (!open) {
                    setName('')
                    setErrorName('')
                }
            }}
        >
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Crear Materia</span>
                </DialogTitle>
                {/* <DialogDescription>
                    Edit the user&apos;s information
                </DialogDescription> */}
                <form
                    action={data => {
                        startTransition(async () => {
                            const subject = await getSubjectByName(
                                data.get('name') as string,
                            )
                            if (subject) {
                                if (subject.status === STATUS.ARCHIVED) {
                                    // reiniciar
                                    setErrorName('')
                                    setName('')
                                    // cerrar el modal
                                    setOpen(false)
                                    // mostrar dialogo
                                    setOpenUnarchiveOrDelete(true)
                                    setUserToEdit(subject)
                                } else setErrorName('La materia ya existe')
                                return
                            }
                            const { error } = await createSubject(data)

                            if (error) setMessage(error)
                            else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    500,
                                )
                                setOpen(false)
                                setName('')
                                setErrorName('')
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
                    <NameInput />
                    <div className='flex w-full gap-4'>
                        <CompletInput
                            required
                            label='Horas de Teoria'
                            type='number'
                            name='theory_hours'
                            min={0}
                            defaultValue={1}
                            icon={ClockFadingIcon}
                        />
                        <CompletInput
                            required
                            label='Horas de práctica'
                            type='number'
                            name='practice_hours'
                            min={0}
                            defaultValue={0}
                            icon={ClockFadingIcon}
                        />
                    </div>

                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Crear
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function NameInput() {
    const [name, setName] = useAtom(nameAtom)
    const [error, setError] = useAtom(errorNameAtom)

    return (
        <CompletInput
            required
            label='Nombre'
            type='text'
            name='name'
            icon={SquarePenIcon}
            value={name}
            onChange={e => {
                setName(e.target.value)
                setError('')
            }}
            error={error}
        />
    )
}
