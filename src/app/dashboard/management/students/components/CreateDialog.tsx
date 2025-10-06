'use client'

import { Career } from '@/prisma/generated/browser'
import { useAtom, useSetAtom } from 'jotai'
import {
    Save,
    UserIcon,
    HashIcon,
    IdCardIcon,
    CalendarRangeIcon,
    GraduationCapIcon,
} from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { getActiveCareers } from '@/actions/career'
import { createStudent } from '@/actions/students'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { CompletInput } from '@/components/Inputs'
import { CompletSelect } from '@/components/Select'
import {
    openCreateAtom,
    updateAtom,
    entityToEditAtom,
} from '@/global/management-students'

export function CreateSubjectDialog() {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateAtom)
    const [careers, setCareers] = useState<Career[]>([])
    const setEntityToEdit = useSetAtom(entityToEditAtom)

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
                            const { error, student } = await createStudent(data)
                            if (error === 'El estudiante esta archivado') {
                                setEntityToEdit(student)
                                setOpen(false)
                            } else if (error) setMessage(error)
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
                        label='Numero de Control'
                        type='text'
                        name='nc'
                        icon={HashIcon}
                    />
                    <CompletInput
                        required
                        label='Nombres'
                        type='text'
                        name='firstname'
                        icon={UserIcon}
                    />
                    <CompletInput
                        required
                        label='Apellidos'
                        type='text'
                        name='lastname'
                        icon={IdCardIcon}
                    />
                    <CompletInput
                        required
                        label='Semestre'
                        type='number'
                        name='semester'
                        icon={CalendarRangeIcon}
                    />
                    <CompletSelect
                        label='Carrera'
                        name='career_id'
                        options={careers.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                        icon={GraduationCapIcon}
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
