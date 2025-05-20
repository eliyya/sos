'use client'

import { getActiveCareers } from '@/actions/career'
import { archiveClass } from '@/actions/class'
import { getSubjectsActive } from '@/actions/subjects'
import { getTeachersActive } from '@/actions/users'
import { Button } from '@/components/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { CompletInput } from '@/components/Inputs'
import {
    openArchiveAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/managment-class'
import { User, Subject, Career } from '@prisma/client'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Archive, Ban, UserIcon } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'

export function ArchiveDialog() {
    const [open, setOpen] = useAtom(openArchiveAtom)
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Archivar Clase</span>
                </DialogTitle>
                <DialogDescription>
                    ¿Está seguro de archivar a esta clase?
                </DialogDescription>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await archiveClass(data)
                            if (error) {
                                setMessage(error)
                                setTimeout(() => setMessage('error'), 5_000)
                            } else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    1_000,
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
                    <input type='hidden' value={entity.id} name='id' />
                    <CompletInput
                        label='Profesor'
                        name='teacher_id'
                        disabled
                        value={
                            teachers.find(t => t.id === entity.teacher_id)?.name
                        }
                        icon={UserIcon}
                    />
                    <CompletInput
                        label='Materia'
                        name='subject_id'
                        disabled
                        value={
                            subjects.find(s => s.id === entity.subject_id)?.name
                        }
                        icon={UserIcon}
                    />
                    <CompletInput
                        label='Carrera'
                        name='career_id'
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
                            <Archive className='mr-2 h-5 w-5' />
                            Archivar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
