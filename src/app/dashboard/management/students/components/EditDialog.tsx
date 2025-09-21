'use client'

import { Career } from '@prisma/client'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    CalendarRangeIcon,
    HashIcon,
    IdCardIcon,
    Save,
    UserIcon,
} from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { getActiveCareers } from '@/actions/career'
import { editStudent } from '@/actions/students'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { RetornableCompletInput } from '@/components/Inputs'
import { RetornableCompletSelect } from '@/components/Select'
import {
    editDialogAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/management-students'


export function EditDialog() {
    const [open, setOpen] = useAtom(editDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)
    const [careers, setCareers] = useState<Career[]>([])

    useEffect(() => {
        getActiveCareers().then(setCareers)
    }, [])

    if (!old) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Estudiante</DialogTitle>
                    <DialogDescription>
                        Edita el estudiante {old.firstname} {old.lastname}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await editStudent(data)
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
                    {message && <MessageError>{message}</MessageError>}
                    <input type='hidden' value={old.nc} name='id' />
                    <RetornableCompletInput
                        originalValue={old.nc}
                        required
                        label='Numero de Control'
                        type='text'
                        name='nc'
                        icon={HashIcon}
                    />
                    <RetornableCompletInput
                        originalValue={old.firstname}
                        required
                        label='Nombres'
                        type='text'
                        name='firstname'
                        icon={UserIcon}
                    />
                    <RetornableCompletInput
                        originalValue={old.lastname}
                        required
                        label='Apellidos'
                        type='text'
                        name='lastname'
                        icon={IdCardIcon}
                    />
                    <RetornableCompletInput
                        originalValue={old.semester}
                        required
                        label='Semestre'
                        type='number'
                        name='semester'
                        icon={CalendarRangeIcon}
                    />
                    <RetornableCompletSelect
                        originalValue={{
                            label: careers.find(c => c.id === old.career_id)
                                ?.name,
                            value: old.career_id,
                        }}
                        options={careers.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                        required
                        label='Carrera'
                        name='career_id'
                        icon={CalendarRangeIcon}
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
