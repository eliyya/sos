'use client'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Activity, use, useCallback, useState, useTransition } from 'react'
import { createSubject } from '@/actions/subjects.actions'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { MessageError } from '@/components/Error'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchSubjectsContext } from '@/contexts/subjects.context'
import { CompletField } from '@/components/ui/complet-field'
import { ClockFadingIcon, SquarePenIcon } from 'lucide-react'

const nameAtom = atom('')
const errorNameAtom = atom('')

const theoryHoursAtom = atom(1)
const errorTheoryHoursAtom = atom('')

const practiceHoursAtom = atom(0)
const errorPracticeHoursAtom = atom('')

export function CreateSubjectDialog() {
    const [dialog, openDialog] = useAtom(dialogAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const setUserToEdit = useSetAtom(selectedIdAtom)
    const router = useRouter()
    const { refresh } = use(SearchSubjectsContext)

    const setName = useSetAtom(nameAtom)
    const setTheoryHours = useSetAtom(theoryHoursAtom)
    const setPracticeHours = useSetAtom(practiceHoursAtom)

    const setErrorName = useSetAtom(errorNameAtom)
    const setErrorTheoryHours = useSetAtom(errorTheoryHoursAtom)
    const setErrorPracticeHours = useSetAtom(errorPracticeHoursAtom)

    const onAction = useCallback(
        (data: FormData) => {
            const name = data.get('name') as string
            const theory_hours = Number(data.get('theory_hours'))
            const practice_hours = Number(data.get('practice_hours'))

            startTransition(async () => {
                const res = await createSubject({
                    name,
                    theory_hours,
                    practice_hours,
                })
                if (res.status === 'success') {
                    openDialog(null)
                    setName('')
                    setTheoryHours(1)
                    setPracticeHours(0)
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
                    setMessage(
                        'Ha ocurrido un error inesperado, intente mas tarde',
                    )
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
            setName,
            setTheoryHours,
            setPracticeHours,
        ],
    )

    return (
        <Dialog
            open={dialog === 'CREATE'}
            onOpenChange={state => openDialog(state ? 'CREATE' : null)}
        >
            <DialogContent>
                <form action={onAction}>
                    <DialogHeader>
                        <DialogTitle>Crear Asignatura</DialogTitle>
                    </DialogHeader>

                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>

                    <NameInput />
                    <div className='flex w-full gap-4'>
                        <TheoryHoursInput />
                        <PracticeHoursInput />
                    </div>

                    <DialogFooter>
                        <DialogClose
                            render={<Button variant='outline'>Cancel</Button>}
                        />
                        <Button type='submit' disabled={inTransition}>
                            Crear
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function NameInput() {
    const [name, setName] = useAtom(nameAtom)
    const error = useAtomValue(errorNameAtom)
    const setError = useSetAtom(errorNameAtom)

    return (
        <CompletField
            label='Nombre'
            name='name'
            icon={SquarePenIcon}
            type='text'
            value={name}
            onChange={e => {
                setName(e.target.value)
                setError('')
            }}
            error={error}
            required
        />
    )
}

function TheoryHoursInput() {
    const [hours, setHours] = useAtom(theoryHoursAtom)
    const error = useAtomValue(errorTheoryHoursAtom)
    const setError = useSetAtom(errorTheoryHoursAtom)

    return (
        <CompletField
            label='Horas Teóricas'
            name='theory_hours'
            icon={ClockFadingIcon}
            type='number'
            value={hours}
            onChange={e => {
                setHours(Number(e.target.value))
                setError('')
            }}
            error={error}
            required
        />
    )
}

function PracticeHoursInput() {
    const [hours, setHours] = useAtom(practiceHoursAtom)
    const error = useAtomValue(errorPracticeHoursAtom)
    const setError = useSetAtom(errorPracticeHoursAtom)

    return (
        <CompletField
            label='Horas Prácticas'
            name='practice_hours'
            icon={ClockFadingIcon}
            type='number'
            value={hours}
            onChange={e => {
                setHours(Number(e.target.value))
                setError('')
            }}
            error={error}
            required
        />
    )
}
