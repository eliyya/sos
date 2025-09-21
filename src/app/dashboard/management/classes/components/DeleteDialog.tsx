'use client'

import { User, Subject, Career } from '@prisma/client'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Ban, Trash2, User as UserIcon } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { getActiveCareers } from '@/actions/career'
import { deleteClass } from '@/actions/class'
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
import { MessageError } from '@/components/Error'
import { CompletInput } from '@/components/Inputs'
import {
    openDeleteAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/management-class'


export function DeleteDialog() {
    const [open, setOpen] = useAtom(openDeleteAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
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

    if (!entity) return null

    const subjectName = subjects.find(s => s.id === entity.subject_id)?.name
    const teacherName = teachers.find(t => t.id === entity.teacher_id)?.name

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar Clase</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de eliminar la clase {subjectName} -{' '}
                        {teacherName}?
                        <strong>Esta acción es irreversible</strong>
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await deleteClass(data)
                            if (error) {
                                setMessage(error)
                                setTimeout(() => setMessage('error'), 5_000)
                            } else {
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
                        <MessageError>{message}</MessageError>
                    )}
                    <input type='hidden' value={entity.id} name='id' />
                    <CompletInput
                        label='Profesor'
                        disabled
                        value={
                            teachers.find(t => t.id === entity.teacher_id)?.name
                        }
                        icon={UserIcon}
                    />
                    <CompletInput
                        label='Materia'
                        disabled
                        value={
                            subjects.find(s => s.id === entity.subject_id)?.name
                        }
                        icon={UserIcon}
                    />
                    <CompletInput
                        label='Carrera'
                        disabled
                        value={
                            careers.find(c => c.id === entity.career_id)?.name
                        }
                        icon={UserIcon}
                    />
                    <CompletInput
                        label='Grupo'
                        icon={UserIcon}
                        type='number'
                        disabled
                        value={entity.group}
                    />
                    <CompletInput
                        label='Semestre'
                        icon={UserIcon}
                        type='number'
                        disabled
                        value={entity.semester}
                    />
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                setOpen(false)
                            }}
                        >
                            <Ban className='mr-2 h-5 w-5' />
                            Cancelar
                        </Button>
                        <Button
                            type='submit'
                            variant={'destructive'}
                            disabled={inTransition}
                        >
                            <Trash2 className='mr-2 h-5 w-5' />
                            Eliminar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
