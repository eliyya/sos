'use client'

import { useAtom, useAtomValue, useSetAtom, atom } from 'jotai'
import {
    Save,
    UserIcon,
    HashIcon,
    IdCardIcon,
    CalendarRangeIcon,
    GraduationCapIcon,
} from 'lucide-react'
import { Activity, use, useCallback, useState, useTransition } from 'react'
import { createStudent } from '@/actions/students.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { CompletInput } from '@/components/Inputs'
import { CompletAsyncSelect } from '@/components/Select'
import {
    careersSelectOptionsAtom,
    dialogAtom,
    selectedIdAtom,
} from '@/global/management.globals'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

import { SearchStudentsContext } from '@/contexts/students.context'
import { searchCareers } from '@/actions/search.actions'

const ncAtom = atom('')
const firstnameAtom = atom('')
const lastnameAtom = atom('')
const groupAtom = atom(1)
const semesterAtom = atom(1)
const errorNcAtom = atom('')
const errorFirstnameAtom = atom('')
const errorLastnameAtom = atom('')
const errorCareerAtom = atom('')
const errorGroupAtom = atom('')
const errorSemesterAtom = atom('')

export function CreateSubjectDialog() {
    const { refreshStudents } = use(SearchStudentsContext)
    const [open, openDialog] = useAtom(dialogAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const setEntityToEdit = useSetAtom(selectedIdAtom)
    const router = useRouter()
    // errors
    const setErrorFirstname = useSetAtom(errorFirstnameAtom)
    const setErrorLastname = useSetAtom(errorLastnameAtom)
    const setErrorCareer = useSetAtom(errorCareerAtom)
    const setErrorGroup = useSetAtom(errorGroupAtom)
    const setErrorSemester = useSetAtom(errorSemesterAtom)

    const onAction = useCallback(
        (formData: FormData) => {
            const nc = formData.get('nc') as string
            const career_id = formData.get('career_id') as string
            const firstname = formData.get('firstname') as string
            const lastname = formData.get('lastname') as string
            const group = Number(formData.get('group'))
            const semester = Number(formData.get('semester'))

            startTransition(async () => {
                const res = await createStudent({
                    nc,
                    career_id,
                    firstname,
                    lastname,
                    group,
                    semester,
                })
                if (res.status === 'success') {
                    refreshStudents()
                    openDialog(null)
                    return
                }
                if (res.type === 'already-archived') {
                    setEntityToEdit(res.nc)
                    openDialog('UNARCHIVE_OR_DELETE')
                } else if (res.type === 'permission') {
                    setMessage(res.message)
                } else if (res.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (res.type === 'invalid-input') {
                    if (res.field === 'firstname') {
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
                } else if (res.type === 'unexpected') {
                    setMessage(
                        'Ha ocurrido un error inesperado, intente mas tarde',
                    )
                }
            })
        },
        [
            refreshStudents,
            openDialog,
            setEntityToEdit,
            router,
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
            onOpenChange={status => openDialog(status ? 'CREATE' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Estudiante</DialogTitle>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>

                    <NCInput />
                    <FirstnameInput />
                    <LastnameInput />
                    <SemesterInput />
                    <GroupInput />
                    <CareerInput />

                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Crear
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function NCInput() {
    const [nc, setNc] = useAtom(ncAtom)
    const error = useAtomValue(errorNcAtom)

    return (
        <CompletInput
            required
            label='Numero de Control'
            type='text'
            name='nc'
            icon={HashIcon}
            value={nc}
            onChange={e => setNc(e.target.value)}
            error={error}
        />
    )
}

export function FirstnameInput() {
    const [firstname, setFirstname] = useAtom(firstnameAtom)
    const error = useAtomValue(errorFirstnameAtom)

    return (
        <CompletInput
            required
            label='Nombres'
            type='text'
            name='firstname'
            icon={UserIcon}
            value={firstname}
            onChange={e => setFirstname(e.target.value)}
            error={error}
        />
    )
}

export function LastnameInput() {
    const [lastname, setLastname] = useAtom(lastnameAtom)
    const error = useAtomValue(errorLastnameAtom)

    return (
        <CompletInput
            required
            label='Apellidos'
            type='text'
            name='lastname'
            icon={IdCardIcon}
            value={lastname}
            onChange={e => setLastname(e.target.value)}
            error={error}
        />
    )
}

export function SemesterInput() {
    const [semester, setSemester] = useAtom(semesterAtom)
    const error = useAtomValue(errorSemesterAtom)

    return (
        <CompletInput
            required
            label='Semestre'
            type='number'
            name='semester'
            icon={CalendarRangeIcon}
            value={semester}
            onChange={e => setSemester(Number(e.target.value))}
            error={error}
        />
    )
}

export function GroupInput() {
    const [group, setGroup] = useAtom(groupAtom)
    const error = useAtomValue(errorGroupAtom)

    return (
        <CompletInput
            required
            label='Grupo'
            type='number'
            name='group'
            icon={IdCardIcon}
            value={group}
            onChange={e => setGroup(Number(e.target.value))}
            error={error}
        />
    )
}

export function CareerInput() {
    const error = useAtomValue(errorCareerAtom)
    const [defaultOptions, setCareersSelectOptions] = useAtom(
        careersSelectOptionsAtom,
    )

    const loadOptions = useCallback(
        (
            inputValue: string,
            callback: (options: { label: string; value: string }[]) => void,
        ) => {
            searchCareers({
                query: inputValue,
            }).then(res => {
                const options = res.careers.map(career => ({
                    label: career.name,
                    value: career.id,
                }))
                setCareersSelectOptions(options)
                callback(options)
            })
        },
        [setCareersSelectOptions],
    )

    return (
        <CompletAsyncSelect
            label='Carrera'
            required
            name='career_id'
            icon={GraduationCapIcon}
            loadOptions={loadOptions}
            defaultOptions={defaultOptions}
            error={error}
        />
    )
}
