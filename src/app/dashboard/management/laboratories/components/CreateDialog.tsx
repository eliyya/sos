'use client'

import { createlab } from '@/actions/laboratory'
import { Button } from '@/components/Button'
import { CompletInput } from '@/components/Inputs'
import { openCreateAtom, updateAtom } from '@/global/managment-laboratory'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { useAtom, useSetAtom } from 'jotai'
import { User, Save } from 'lucide-react'
import { useState, useTransition } from 'react'
import { CompletSelect } from '@/components/Select'
import { LABORATORY_TYPE } from '@/prisma/client/enums'

export function CreateSubjectDialog() {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateAtom)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Crear Estudiante</span>
                </DialogTitle>
                {/* <DialogDescription>
                    Edit the user&apos;s information
                </DialogDescription> */}
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await createlab(data)
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
                    <CompletInput
                        required
                        label='Apertura'
                        type='time'
                        name='open_hour'
                        defaultValue={'08:00'}
                    >
                        <User className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </CompletInput>
                    <CompletInput
                        required
                        label='Cierre'
                        type='time'
                        name='close_hour'
                        defaultValue={'20:00'}
                    >
                        <User className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </CompletInput>
                    <CompletSelect
                        required
                        label='Tipo de Laboratorio'
                        name='type'
                        defaultValue={{
                            value: LABORATORY_TYPE.LABORATORY,
                            label: 'Laboratorio',
                        }}
                        options={[
                            {
                                value: LABORATORY_TYPE.LABORATORY,
                                label: 'Laboratorio',
                            },
                            {
                                value: LABORATORY_TYPE.COMPUTER_CENTER,
                                label: 'Centro de Computo',
                            },
                        ]}
                    >
                        <User className='absolute top-2.5 left-3 z-10 h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </CompletSelect>

                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Crear
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
