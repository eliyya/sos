'use client'

import { createlab } from '@/actions/laboratory'
import { Button } from '@/components/Button'
import {
    errorNameAtom,
    errorOpenHourAtom,
    openCreateAtom,
    updateAtom,
} from '@/global/managment-laboratory'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { useAtom, useSetAtom } from 'jotai'
import { Save } from 'lucide-react'
import { useState, useTransition } from 'react'
import { NameInput } from './NameInput'
import { OpenHourInput } from './OpenHourInput'
import { CloseHourInput } from './CloseHourInput'
import { LaboratoryTypeSelect } from './LaboratoryTypeSelect'
import { MessageError } from '@/components/Error'

export function CreateSubjectDialog() {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateAtom)
    const setNameError = useSetAtom(errorNameAtom)
    const setOpenError = useSetAtom(errorOpenHourAtom)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Crear Laboratorio</span>
                </DialogTitle>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await createlab(data)
                            if (!error) {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    500,
                                )
                                return setOpen(false)
                            }
                            if (error === 'El laboratorio ya existe') {
                                setNameError(error)
                            } else if (
                                error ===
                                'La hora de apertura debe ser menor a la de cierre'
                            ) {
                                setOpenError(error)
                            } else {
                                setMessage(error)
                                setTimeout(() => {
                                    setMessage('')
                                }, 5_000)
                            }
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && <MessageError>{message}</MessageError>}
                    <NameInput />
                    <OpenHourInput />
                    <CloseHourInput />
                    <LaboratoryTypeSelect />

                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Crear
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
