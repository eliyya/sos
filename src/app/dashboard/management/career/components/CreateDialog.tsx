'use client'

import { createCareer } from '@/actions/career'
import { Button } from '@/components/Button'
import { CompletInput } from '@/components/Inputs'
import {
    entityToEditAtom,
    openCreateAtom,
    updateAtom,
} from '@/global/management-career'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { useAtom, useSetAtom } from 'jotai'
import { Save, TagIcon, SquarePenIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { MessageError } from '@/components/Error'

export function CreateSubjectDialog() {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateAtom)
    const setEntityToEdit = useSetAtom(entityToEditAtom)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Carrera</DialogTitle>
                    {/* <DialogDescription>
                        Edit the user&apos;s information
                    </DialogDescription> */}
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error, career } = await createCareer(data)

                            if (error === 'La carrera esta archivada') {
                                setMessage(error)
                                setEntityToEdit(career)
                            } else if (error) {
                                setMessage(error)
                            } else {
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
                    {message && <MessageError>{message}</MessageError>}
                    <CompletInput
                        required
                        label='Nombre'
                        type='text'
                        name='name'
                        icon={SquarePenIcon}
                    />
                    <CompletInput
                        label='Alias'
                        type='text'
                        name='alias'
                        icon={TagIcon}
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
