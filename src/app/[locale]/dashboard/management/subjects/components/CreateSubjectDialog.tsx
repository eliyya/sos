'use client'

import { atom, useAtom, useSetAtom } from 'jotai'
import { Save, SquarePenIcon, ClockFadingIcon } from 'lucide-react'
import { Activity, use, useCallback, useState, useTransition } from 'react'
import { createSubject } from '@/actions/subjects.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { CompletInput } from '@/components/Inputs'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchSubjectsContext } from '@/contexts/subjects.context'

const nameAtom = atom('')
const errorNameAtom = atom('')

const theoryHoursAtom = atom(1)
const practiceHoursAtom = atom(0)
const errorTheoryHoursAtom = atom('')
const errorPracticeHoursAtom = atom('')

export function CreateSubjectDialog() {
    const [dialog, openDialog] = useAtom(dialogAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const setErrorName = useSetAtom(errorNameAtom)
    const setErrorTheoryHours = useSetAtom(errorTheoryHoursAtom)
    const setErrorPracticeHours = useSetAtom(errorPracticeHoursAtom)
    const setUserToEdit = useSetAtom(selectedIdAtom)
    const router = useRouter()
    const { refresh } = use(SearchSubjectsContext)

    const onAction = useCallback(
        async (formData: FormData) => {
            const name = formData.get('name') as string
            const theory_hours = Number(formData.get('theory_hours'))
            const practice_hours = Number(formData.get('practice_hours'))

            startTransition(async () => {
                const res = await createSubject({
                    name,
                    theory_hours,
                    practice_hours,
                })
                if (res.status === 'success') {
                    openDialog(null)
                    refresh()
                    return
                }
                if (res.type === 'permission') {
                    setMessage('No tienes permiso para crear esta asignatura')
                } else if (res.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (res.type === 'already-exists') {
                    setErrorName('Ya existe una asignatura con este nombre')
                } else if (res.type === 'invalid-input') {
                    if (res.field === 'name') {
                        setErrorName(res.message)
                    } else if (res.field === 'theory_hours') {
                        setErrorTheoryHours(res.message)
                    } else if (res.field === 'practice_hours') {
                        setErrorPracticeHours(res.message)
                    }
                } else if (res.type === 'already-archived') {
                    setUserToEdit(res.id)
                    openDialog('EDIT')
                } else if (res.type === 'unexpected') {
                    setMessage('Ha ocurrido un error, intentalo más tarde')
                }
            })
        },
        [
            openDialog,
            refresh,
            router,
            setErrorName,
            setErrorTheoryHours,
            setErrorPracticeHours,
            setUserToEdit,
        ],
    )

    return (
        <Dialog
            open={dialog === 'CREATE'}
            onOpenChange={open => {
                openDialog(open ? 'CREATE' : null)
                if (!open) {
                    setErrorName('')
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Asignatura</DialogTitle>
                </DialogHeader>
                {/* <DialogDescription>
                    Edit the user&apos;s information
                </DialogDescription> */}
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <NameInput />
                    <div className='flex w-full gap-4'>
                        <TehoryHoursInput />
                        <PracticeHoursInput />
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

function NameInput() {
    const [name, setName] = useAtom(nameAtom)
    const [error, setError] = useAtom(errorNameAtom)

    return (
        <CompletInput
            required
            label='Nombre'
            type='text'
            name='name'
            icon={SquarePenIcon}
            value={name}
            onChange={e => {
                setName(e.target.value)
                setError('')
            }}
            error={error}
        />
    )
}

function TehoryHoursInput() {
    const [hours, setHours] = useAtom(theoryHoursAtom)
    const [error, setError] = useAtom(errorTheoryHoursAtom)

    return (
        <CompletInput
            required
            label='Horas'
            type='number'
            name='hours'
            icon={ClockFadingIcon}
            value={hours}
            onChange={e => {
                setHours(Number(e.target.value))
                setError('')
            }}
            error={error}
        />
    )
}

function PracticeHoursInput() {
    const [hours, setHours] = useAtom(practiceHoursAtom)
    const [error, setError] = useAtom(errorPracticeHoursAtom)

    return (
        <CompletInput
            required
            label='Horas'
            type='number'
            name='hours'
            icon={ClockFadingIcon}
            value={hours}
            onChange={e => {
                setHours(Number(e.target.value))
                setError('')
            }}
            error={error}
        />
    )
}
