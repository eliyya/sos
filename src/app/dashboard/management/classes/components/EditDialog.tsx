'use client'

import { getActiveCareers } from '@/actions/career'
import { editClass } from '@/actions/class'
import { getSubjectsActive } from '@/actions/subjects'
import { getTeachersActive } from '@/actions/users'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { RetornableCompletInput } from '@/components/Inputs'
import { RetornableCompletSelect } from '@/components/Select'
import {
    editDialogAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/management-class'
import { Career, Subject, User } from '@prisma/client'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Save, UserIcon } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'

export function EditDialog() {
    const [open, setOpen] = useAtom(editDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)
    const [careers, setCareers] = useState<Career[]>([])
    const [teachers, setTeachers] = useState<User[]>([])
    const [subjects, setSubjects] = useState<Subject[]>([])

    useEffect(() => {
        getActiveCareers().then(careers => {
            setCareers(careers)
        })
        getTeachersActive().then(users => {
            setTeachers(users)
        })
        getSubjectsActive().then(subjects => {
            setSubjects(subjects)
        })
    }, [])

    if (!old) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Clase</DialogTitle>
                    <DialogDescription>
                        Edita la clase{' '}
                        {subjects.find(s => s.id === old.subject_id)?.name}{' '}
                        {careers.find(c => c.id === old.career_id)?.alias ??
                            careers.find(c => c.id === old.career_id)?.name}
                        {old.group}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await editClass(data)
                            if (error) setMessage(error)
                            else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    500,
                                )
                                setOpen(false)
                            }
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && (
                        <span className='animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md'>
                            {message}
                        </span>
                    )}
                    <input type='hidden' value={old.id} name='nc' />
                    <RetornableCompletSelect
                        originalValue={{
                            label: teachers.find(t => t.id === old.teacher_id)
                                ?.name,
                            value: old.career_id,
                        }}
                        label='Docente'
                        name='teacher_id'
                        options={teachers.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                        icon={UserIcon}
                    />
                    <RetornableCompletSelect
                        originalValue={{
                            label: subjects.find(t => t.id === old.subject_id)
                                ?.name,
                            value: old.career_id,
                        }}
                        label='Materia'
                        name='subject_id'
                        options={subjects.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                        icon={UserIcon}
                    />
                    <RetornableCompletSelect
                        originalValue={{
                            label: careers.find(t => t.id === old.career_id)
                                ?.name,
                            value: old.career_id,
                        }}
                        label='Carrera'
                        name='career_id'
                        options={careers.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                        icon={UserIcon}
                    />
                    <RetornableCompletInput
                        label='Grupo'
                        name='group'
                        icon={UserIcon}
                        type='number'
                        min={0}
                        originalValue={old.group}
                    />
                    <RetornableCompletInput
                        label='Semestre'
                        name='semester'
                        icon={UserIcon}
                        type='number'
                        min={0}
                        originalValue={old.semester}
                    />
                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
