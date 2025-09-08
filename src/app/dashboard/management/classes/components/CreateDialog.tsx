'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { CompletSelect } from '@/components/Select'
import { CompletInput } from '@/components/Inputs'
import { useState, useTransition } from 'react'
import {
    UserIcon,
    Save,
    BookAIcon,
    GraduationCapIcon,
    UsersIcon,
    HashIcon,
} from 'lucide-react'
import { MessageError } from '@/components/Error'
import { checkClassDisponibility, createClass } from '@/actions/class'
import { Button } from '@/components/Button'
import { STATUS } from '@prisma/client'
import {
    careersAtom,
    entityToEditAtom,
    openCreateAtom,
    openUnarchiveOrDeleteAtom,
    subjectsAtom,
    updateAtom,
    usersAtom,
} from '@/global/management-class'

export function CreateSubjectDialog() {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateAtom)
    const setEntityToEdit = useSetAtom(entityToEditAtom)
    const setOpenUnarchiveOrDelete = useSetAtom(openUnarchiveOrDeleteAtom)
    const users = useAtomValue(usersAtom).filter(
        c => c.status === STATUS.ACTIVE,
    )
    const subjects = useAtomValue(subjectsAtom).filter(
        c => c.status === STATUS.ACTIVE,
    )
    const careers = useAtomValue(careersAtom).filter(
        c => c.status === STATUS.ACTIVE,
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Clase</DialogTitle>
                    {/* <DialogDescription>
                        Edit the user&apos;s information
                    </DialogDescription> */}
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            // check if the class already exists
                            const career_id = data.get('career_id') as string
                            const group = Number(data.get('group'))
                            const semester = Number(data.get('semester'))
                            const subject_id = data.get('subject_id') as string
                            const teacher_id = data.get('teacher_id') as string
                            const { clase, status } =
                                await checkClassDisponibility({
                                    career_id,
                                    group,
                                    semester,
                                    subject_id,
                                    teacher_id,
                                })
                            if (status === 'archived') {
                                // show message
                                setEntityToEdit(clase)
                                setOpen(false)
                                setOpenUnarchiveOrDelete(true)
                                return
                            }
                            if (status === 'taken') {
                                // show message
                                setMessage('La clase ya existe')
                                return
                            }
                            const { error } = await createClass(data)

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
                    <CompletSelect
                        label='Profesor'
                        name='teacher_id'
                        options={users.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                        icon={UserIcon}
                    />
                    <CompletSelect
                        label='Materia'
                        name='subject_id'
                        options={subjects.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                        icon={BookAIcon}
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
                    <CompletInput
                        label='Grupo'
                        name='group'
                        icon={UsersIcon}
                        type='number'
                        min={0}
                        defaultValue={1}
                    />
                    <CompletInput
                        label='Semestre'
                        name='semester'
                        icon={HashIcon}
                        type='number'
                        min={0}
                        defaultValue={1}
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
