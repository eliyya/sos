'use client'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Activity, use, useCallback, useState, useTransition } from 'react'
import { createStudent } from '@/actions/students.actions'
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
import { SearchStudentsContext } from '@/contexts/students.context'
import { CompletField } from '@/components/ui/complet-field'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
    AsyncCombobox,
    AsyncComboboxItem,
} from '@/components/ui/async-combobox'
import { searchCareers } from '@/actions/search.actions'
import {
    CalendarRangeIcon,
    GraduationCapIcon,
    HashIcon,
    IdCardIcon,
    UserIcon,
} from 'lucide-react'

const errorNcAtom = atom('')
const errorFirstnameAtom = atom('')
const errorLastnameAtom = atom('')
const errorCareerAtom = atom('')
const errorGroupAtom = atom('')
const errorSemesterAtom = atom('')

export function CreateSubjectDialog() {
    const { refresh } = use(SearchStudentsContext)
    const [open, openDialog] = useAtom(dialogAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const setEntityToEdit = useSetAtom(selectedIdAtom)
    const router = useRouter()

    const setErrorNc = useSetAtom(errorNcAtom)
    const setErrorFirstname = useSetAtom(errorFirstnameAtom)
    const setErrorLastname = useSetAtom(errorLastnameAtom)
    const setErrorCareer = useSetAtom(errorCareerAtom)
    const setErrorGroup = useSetAtom(errorGroupAtom)
    const setErrorSemester = useSetAtom(errorSemesterAtom)

    const onAction = useCallback(
        (data: FormData) => {
            const nc = data.get('nc') as string
            const firstname = data.get('firstname') as string
            const lastname = data.get('lastname') as string
            const career_id = data.get('career_id') as string
            const group = Number(data.get('group'))
            const semester = Number(data.get('semester'))

            startTransition(async () => {
                const res = await createStudent({
                    nc,
                    firstname,
                    lastname,
                    career_id,
                    group,
                    semester,
                })
                if (res.status === 'success') {
                    openDialog(null)
                    refresh()
                    return
                }
                if (res.type === 'already-archived') {
                    setEntityToEdit(res.nc)
                    openDialog('UNARCHIVE_OR_DELETE')
                } else if (res.type === 'permission') {
                    setMessage('No tienes permiso para crear este estudiante')
                } else if (res.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (res.type === 'invalid-input') {
                    if (res.field === 'nc') {
                        setErrorNc(res.message)
                    } else if (res.field === 'firstname') {
                        setErrorFirstname(res.message)
                    } else if (res.field === 'lastname') {
                        setErrorLastname(res.message)
                    } else if (res.field === 'career_id') {
                        setErrorCareer(res.message)
                    } else if (res.field === 'group') {
                        setErrorGroup(res.message)
                    } else if (res.field === 'semester') {
                        setErrorSemester(res.message)
                    }
                } else if (res.type === 'already-exists') {
                    setErrorNc(
                        'Ya existe un estudiante con este número de control',
                    )
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
            setEntityToEdit,
            setErrorNc,
            setErrorFirstname,
            setErrorLastname,
            setErrorCareer,
            setErrorGroup,
            setErrorSemester,
        ],
    )

    return (
        <Dialog
            open={open === 'CREATE'}
            onOpenChange={state => openDialog(state ? 'CREATE' : null)}
        >
            <DialogContent>
                <form action={onAction}>
                    <DialogHeader>
                        <DialogTitle>Crear Estudiante</DialogTitle>
                    </DialogHeader>

                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>

                    <NcInput />
                    <div className='flex w-full gap-4'>
                        <FirstnameInput />
                        <LastnameInput />
                    </div>
                    <CareerInput />
                    <div className='flex w-full gap-4'>
                        <GroupInput />
                        <SemesterInput />
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

function NcInput() {
    const error = useAtomValue(errorNcAtom)
    return (
        <CompletField
            label='Número de Control'
            name='nc'
            icon={IdCardIcon}
            type='text'
            error={error}
            required
        />
    )
}

function FirstnameInput() {
    const error = useAtomValue(errorFirstnameAtom)
    return (
        <CompletField
            label='Nombre'
            name='firstname'
            icon={UserIcon}
            type='text'
            error={error}
            required
        />
    )
}

function LastnameInput() {
    const error = useAtomValue(errorLastnameAtom)
    return (
        <CompletField
            label='Apellido'
            name='lastname'
            icon={UserIcon}
            type='text'
            error={error}
            required
        />
    )
}

function CareerInput() {
    const error = useAtomValue(errorCareerAtom)
    const [value, setValue] = useState<AsyncComboboxItem | null>(null)

    return (
        <Field>
            <FieldLabel>Carrera</FieldLabel>
            <AsyncCombobox
                name='career_id'
                placeholder='Seleccionar carrera'
                searchPlaceholder='Buscar carrera...'
                value={value}
                onChange={setValue}
                onSearch={async query => {
                    const res = await searchCareers({ query })
                    return res.careers.map(c => ({
                        value: c.id,
                        label: c.alias,
                    }))
                }}
            />
            <FieldError errors={error ? [{ message: error }] : []} />
        </Field>
    )
}

function GroupInput() {
    const [group, setGroup] = useAtom(atom(1))
    const error = useAtomValue(errorGroupAtom)

    return (
        <CompletField
            label='Grupo'
            name='group'
            icon={UserIcon}
            type='number'
            value={group}
            onChange={e => setGroup(Number(e.target.value))}
            error={error}
            required
        />
    )
}

function SemesterInput() {
    const [semester, setSemester] = useAtom(atom(1))
    const error = useAtomValue(errorSemesterAtom)

    return (
        <CompletField
            label='Semestre'
            name='semester'
            icon={HashIcon}
            type='number'
            value={semester}
            onChange={e => setSemester(Number(e.target.value))}
            error={error}
            required
        />
    )
}
