'use client'

import { createClass } from '@/actions/class'
import { Button } from '@/components/Button'
import { openCreateAtom, updateAtom } from '@/global/managment-class'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { useAtom, useSetAtom } from 'jotai'
import { UserIcon, Save } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { Career, Subject, User } from '@/prisma/client'
import { getTeachersActive } from '@/actions/users'
import { CompletSelect } from '@/components/Select'
import { getSubjectsActive } from '@/actions/subjects'
import { getActiveCareers } from '@/actions/career'

export function CreateSubjectDialog() {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateAtom)
    const [teachers, setTeachers] = useState<User[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [careers, setCareers] = useState<Career[]>([])

    useEffect(() => {
        getTeachersActive().then(users => {
            setTeachers(users)
        })
        getSubjectsActive().then(subjects => {
            setSubjects(subjects)
        })
        getActiveCareers().then(careers => {
            setCareers(careers)
        })
    }, [])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Crear Clase</span>
                </DialogTitle>
                {/* <DialogDescription>
                    Edit the user&apos;s information
                </DialogDescription> */}
                <form
                    action={data => {
                        console.log(Object.fromEntries(data.entries()))

                        startTransition(async () => {
                            const { error } = await createClass(data)

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
                    <CompletSelect
                        label='Profesor'
                        name='teacher_id'
                        options={teachers.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                    >
                        <UserIcon className='absolute top-2.5 left-3 z-10 h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </CompletSelect>
                    <CompletSelect
                        label='Materia'
                        name='subject_id'
                        options={subjects.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                    >
                        <UserIcon className='absolute top-2.5 left-3 z-10 h-5 w-5 text-gray-500 dark:text-gray-400' />
                    </CompletSelect>
                    <CompletSelect
                        label='Carrera'
                        name='career_id'
                        options={careers.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                    >
                        <UserIcon className='absolute top-2.5 left-3 z-10 h-5 w-5 text-gray-500 dark:text-gray-400' />
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
