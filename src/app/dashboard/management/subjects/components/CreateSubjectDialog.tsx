'use client'

import { createSubject } from '@/actions/subjects'
import { Button } from '@/components/Button'
import { CompletInput } from '@/components/Inputs'
import { openCreateAtom, updateAtom } from '@/global/managment-subjects'
import {
    Dialog,
    DialogContent,
    // DialogDescription,
    DialogTitle,
} from '@/components/Dialog'
import { useAtom, useSetAtom } from 'jotai'
import { User, Save } from 'lucide-react'
import { useState, useTransition } from 'react'

export function CreateSubjectDialog() {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateAtom)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Crear Materia</span>
                </DialogTitle>
                {/* <DialogDescription>
                    Edit the user&apos;s information
                </DialogDescription> */}
                <form
                    action={data => {
                        console.log(Object.fromEntries(data.entries()))

                        startTransition(async () => {
                            const { error } = await createSubject(data)

                            if (error) setMessage(error)
                            else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    1_000,
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
                        label='Nombre'
                        type='text'
                        name='name'
                    >
                        <User className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </CompletInput>
                    <div className='flex w-full gap-4'>
                        <CompletInput
                            required
                            label='Horas de Teoria'
                            type='number'
                            name='theory_hours'
                            min={0}
                            defaultValue={1}
                        >
                            <User className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                        </CompletInput>
                        <CompletInput
                            required
                            label='Horas de práctica'
                            type='number'
                            name='practice_hours'
                            min={0}
                            defaultValue={0}
                        >
                            <User className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                        </CompletInput>
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
