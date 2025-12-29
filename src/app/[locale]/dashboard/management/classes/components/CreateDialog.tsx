'use client'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { UsersIcon, HashIcon } from 'lucide-react'
import { Activity, use, useCallback, useState, useTransition } from 'react'
import { createClass } from '@/actions/classes.actions'
import { Button } from '@/components/Button'
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
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import {
    searchUsers,
    searchSubjects,
    searchCareers,
} from '@/actions/search.actions'
import { SearchClassesContext } from '@/contexts/classes.context'
import { CompletField } from '@/components/ui/complet-field'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
    AsyncCombobox,
    AsyncComboboxItem,
} from '@/components/ui/async-combobox'

const errorCareerIdAtom = atom('')
const errorSubjectIdAtom = atom('')
const errorTeacherIdAtom = atom('')
const groupAtom = atom(1)
const semesterAtom = atom(1)
const errorGroupAtom = atom('')
const errorSemesterAtom = atom('')

export function CreateSubjectDialog() {
    const [open, openDialog] = useAtom(dialogAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const setEntityToEdit = useSetAtom(selectedIdAtom)
    const { refresh } = use(SearchClassesContext)
    const t = useTranslations('classes')
    const router = useRouter()
    const setTeacherError = useSetAtom(errorTeacherIdAtom)
    const setSubjectError = useSetAtom(errorSubjectIdAtom)
    const setCareerError = useSetAtom(errorCareerIdAtom)
    const setGroupError = useSetAtom(errorGroupAtom)
    const setSemesterError = useSetAtom(errorSemesterAtom)

    const onAction = useCallback(
        (data: FormData) => {
            const career_id = data.get('career_id') as string
            const group = Number(data.get('group'))
            const semester = Number(data.get('semester'))
            const subject_id = data.get('subject_id') as string
            const teacher_id = data.get('teacher_id') as string
            console.log({ career_id, group, semester, subject_id, teacher_id })
            startTransition(async () => {
                const res = await createClass({
                    career_id,
                    group,
                    semester,
                    subject_id,
                    teacher_id,
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
                    setMessage(res.message)
                } else if (res.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (res.type === 'invalid-input') {
                    if (res.field === 'career_id') {
                        setCareerError(res.message)
                    } else if (res.field === 'subject_id') {
                        setSubjectError(res.message)
                    } else if (res.field === 'teacher_id') {
                        setTeacherError(res.message)
                    } else if (res.field === 'group') {
                        setGroupError(res.message)
                    } else if (res.field === 'semester') {
                        setSemesterError(res.message)
                    }
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
            setCareerError,
            setEntityToEdit,
            setGroupError,
            setSemesterError,
            setSubjectError,
            setTeacherError,
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
                        <DialogTitle>{t('create_class')}</DialogTitle>
                    </DialogHeader>

                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <TeacherInput />
                    <SubjectInput />
                    <CareerInput />
                    <GroupInput />
                    <SemesterInput />
                    <DialogFooter>
                        <DialogClose
                            render={<Button variant='outline'>Cancel</Button>}
                        />
                        <Button type='submit' disabled={inTransition}>
                            Reservar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function TeacherInput() {
    const error = useAtomValue(errorTeacherIdAtom)
    return (
        <Field>
            <FieldLabel>Docente</FieldLabel>
            <AsyncCombobox
                name='teacher_id'
                placeholder='Seleccionar docente'
                searchPlaceholder='Buscar docente...'
                onSearch={async query => {
                    const classes = await searchUsers({
                        query,
                    })

                    return classes.users.map(c => ({
                        value: c.id,
                        label: c.name,
                    }))
                }}
            />
            <FieldError errors={error ? [{ message: error }] : []} />
        </Field>
    )
}

export function SubjectInput() {
    const error = useAtomValue(errorSubjectIdAtom)
    return (
        <Field>
            <FieldLabel>Materia</FieldLabel>
            <AsyncCombobox
                name='subject_id'
                placeholder='Seleccionar materia'
                searchPlaceholder='Buscar materia...'
                onSearch={async query => {
                    const classes = await searchSubjects({
                        query,
                    })

                    return classes.subjects.map(c => ({
                        value: c.id,
                        label: c.name,
                    }))
                }}
            />
            <FieldError errors={error ? [{ message: error }] : []} />
        </Field>
    )
}

export function CareerInput() {
    const error = useAtomValue(errorCareerIdAtom)
    const [value, setValue] = useState<AsyncComboboxItem | null>(null)
    return (
        <Field>
            <FieldLabel>Carrera</FieldLabel>
            <AsyncCombobox
                name='career_id'
                placeholder='Seleccionar carrera'
                searchPlaceholder='Buscar carrera...'
                disabled={false}
                value={value}
                onChange={setValue}
                onSearch={async query => {
                    const classes = await searchCareers({
                        query,
                    })

                    return classes.careers.map(c => ({
                        value: c.id,
                        label: c.alias,
                    }))
                }}
            />
            <FieldError errors={error ? [{ message: error }] : []} />
        </Field>
    )
}

export function GroupInput() {
    const [group, setGroup] = useAtom(groupAtom)
    const error = useAtomValue(errorGroupAtom)

    return (
        <CompletField
            label='Grupo'
            name='group'
            icon={UsersIcon}
            type='number'
            value={group}
            onChange={e => setGroup(Number(e.target.value))}
            error={error}
        />
    )
}

export function SemesterInput() {
    const [semester, setSemester] = useAtom(semesterAtom)
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
        />
    )
}
