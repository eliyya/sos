'use client'

import { createStudent } from '@/actions/students'
import { Button } from '@/components/Button'
import { CompletInput } from '@/components/Inputs'
import { openCreateAtom, updateAtom } from '@/global/managment-students'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Dialog'
import { useAtom, useSetAtom } from 'jotai'
import { User, Save, UserIcon } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { CompletSelect } from '@/components/Select'
import { getActiveCareers } from '@/actions/career'
import { Career } from '@prisma/client'

export function CreateSubjectDialog() {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateAtom)
    const [careers, setCareers] = useState<Career[]>([])

    useEffect(() => {
        getActiveCareers().then(careers => {
            setCareers(careers)
        })
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Estudiante</DialogTitle>
                </DialogHeader>
                {/* <DialogDescription>
                    Edit the user&apos;s information
                </DialogDescription> */}
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await createStudent(data)
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
                        label='Numero de Control'
                        type='text'
                        name='nc'
                        icon={User}
                    />
                    <CompletInput
                        required
                        label='Nombres'
                        type='text'
                        name='firstname'
                        icon={User}
                    />
                    <CompletInput
                        required
                        label='Apellidos'
                        type='text'
                        name='lastname'
                        icon={User}
                    />
                    <CompletInput
                        required
                        label='Semestre'
                        type='number'
                        name='semester'
                        icon={User}
                    />
                    <CompletSelect
                        label='Carrera'
                        name='career_id'
                        options={careers.map(t => ({
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
