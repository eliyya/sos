'use client'

import { useAtom, useSetAtom } from 'jotai'
import { User, Save } from 'lucide-react'
import { useState, useTransition } from 'react'

import { createSoftware } from '@/actions/software'
import { Button } from '@/components/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { CompletInput } from '@/components/Inputs'
import { openCreateAtom, updateAtom } from '@/global/managment-software'


export function CreateSubjectDialog() {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateAtom)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Software</DialogTitle>
                </DialogHeader>
                {/* <DialogDescription>
                    Edit the user&apos;s information
                </DialogDescription> */}
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await createSoftware(data)
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
                    {message && <MessageError>{message}</MessageError>}
                    <CompletInput
                        required
                        label='Nombre'
                        type='text'
                        name='name'
                        icon={User}
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
