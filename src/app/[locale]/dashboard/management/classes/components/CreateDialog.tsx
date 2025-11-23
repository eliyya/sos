'use client'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    UserIcon,
    Save,
    BookAIcon,
    GraduationCapIcon,
    UsersIcon,
    HashIcon,
} from 'lucide-react'
import { Activity, use, useCallback, useState, useTransition } from 'react'
import { createClass } from '@/actions/classes.actions'
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
    subjectsSelectOptionsAtom,
    usersSelectOptionsAtom,
} from '@/global/management.globals'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import {
    searchUsers,
    searchSubjects,
    searchCareers,
} from '@/actions/search.actions'

import { SearchClassesContext } from '@/contexts/classes.context'

const teacherAtom = atom<{ label: string; value: string } | null>(null)
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
                <DialogHeader>
                    <DialogTitle>{t('create_class')}</DialogTitle>
                    {/* <DialogDescription>
                        Edit the user&apos;s information
                    </DialogDescription> */}
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <TeacherInput />
                    <SubjectInput />
                    <CareerInput />
                    <GroupInput />
                    <SemesterInput />

                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        {t('create')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function TeacherInput() {
    const [teacher, setTeacher] = useAtom(teacherAtom)
    const error = useAtomValue(errorTeacherIdAtom)
    const [defaultOptions, setUsersSelectOptions] = useAtom(
        usersSelectOptionsAtom,
    )

    const loadOptions = useCallback(
        (
            inputValue: string,
            callback: (options: { label: string; value: string }[]) => void,
        ) => {
            searchUsers({
                query: inputValue,
            }).then(res => {
                const options = res.users.map(u => ({
                    label: u.name,
                    value: u.id,
                }))
                setUsersSelectOptions(options)
                callback(options)
            })
        },
        [setUsersSelectOptions],
    )

    return (
        <CompletAsyncSelect
            label='Profesor'
            name='teacher_id'
            loadOptions={loadOptions}
            icon={UserIcon}
            value={teacher}
            onChange={e => setTeacher(e)}
            defaultOptions={defaultOptions}
            error={error}
            cacheOptions={true}
        />
    )
}

export function SubjectInput() {
    const error = useAtomValue(errorSubjectIdAtom)

    const [defaultOptions, setSubjectsSelectOptions] = useAtom(
        subjectsSelectOptionsAtom,
    )

    const loadOptions = useCallback(
        (
            inputValue: string,
            callback: (options: { label: string; value: string }[]) => void,
        ) => {
            searchSubjects({
                query: inputValue,
            }).then(res => {
                const options = res.subjects.map(subject => ({
                    label: subject.name,
                    value: subject.id,
                }))
                setSubjectsSelectOptions(options)
                callback(options)
            })
        },
        [setSubjectsSelectOptions],
    )

    return (
        <CompletAsyncSelect
            label='Materia'
            name='subject_id'
            loadOptions={loadOptions}
            icon={BookAIcon}
            defaultOptions={defaultOptions}
            error={error}
        />
    )
}

export function CareerInput() {
    const error = useAtomValue(errorCareerIdAtom)
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
            name='career_id'
            loadOptions={loadOptions}
            icon={GraduationCapIcon}
            defaultOptions={defaultOptions}
            error={error}
        />
    )
}

export function GroupInput() {
    const [group, setGroup] = useAtom(groupAtom)
    const error = useAtomValue(errorGroupAtom)

    return (
        <CompletInput
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
        <CompletInput
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
