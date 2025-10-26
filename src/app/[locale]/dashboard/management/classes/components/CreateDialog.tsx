'use client'

import { STATUS } from '@/prisma/generated/browser'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    UserIcon,
    Save,
    BookAIcon,
    GraduationCapIcon,
    UsersIcon,
    HashIcon,
} from 'lucide-react'
import { Activity, useCallback, useMemo, useState, useTransition } from 'react'
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
import { CompletSelect } from '@/components/Select'
import { openDialogAtom, selectedClassIdAtom } from '@/global/classes.globals'
import { useUsers } from '@/hooks/users.hooks'
import { useTranslations } from 'next-intl'
import { useSubjects } from '@/hooks/subjects.hooks'
import { useCareers } from '@/hooks/careers.hooks'
import { useClasses } from '@/hooks/classes.hooks'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

const careerIdAtom = atom('')
const subjectIdAtom = atom('')
const teacherIdAtom = atom('')
const errorCareerIdAtom = atom('')
const errorSubjectIdAtom = atom('')
const errorTeacherIdAtom = atom('')
const groupAtom = atom(1)
const semesterAtom = atom(1)
const errorGroupAtom = atom('')
const errorSemesterAtom = atom('')

export function CreateSubjectDialog() {
    const [open, openDialog] = useAtom(openDialogAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const setEntityToEdit = useSetAtom(selectedClassIdAtom)
    const { activeUsers } = useUsers()
    const { subjects } = useSubjects()
    const { careers } = useCareers()
    const { setClasses } = useClasses()
    const t = useTranslations('classes')
    const router = useRouter()
    const setTeacherError = useSetAtom(errorTeacherIdAtom)
    const setSubjectError = useSetAtom(errorSubjectIdAtom)
    const setCareerError = useSetAtom(errorCareerIdAtom)
    const setGroupError = useSetAtom(errorGroupAtom)
    const setSemesterError = useSetAtom(errorSemesterAtom)

    const teachersOptions = useMemo(() => {
        return activeUsers.map(u => ({
            label: u.name,
            value: u.id,
        }))
    }, [activeUsers])

    const subjectsOptions = useMemo(() => {
        return subjects.map(s => ({
            label: s.name,
            value: s.id,
        }))
    }, [subjects])

    const careersOptions = useMemo(() => {
        return careers.map(c => ({
            label: c.name,
            value: c.id,
        }))
    }, [careers])

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
                    setClasses(prev => [...prev, res.class])
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
        [openDialog],
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
    const [teacherId, setTeacherId] = useAtom(teacherIdAtom)
    const error = useAtomValue(errorTeacherIdAtom)
    const { activeUsers } = useUsers()

    const activeUsersOptions = useMemo(() => {
        return activeUsers.map(u => ({
            label: u.name,
            value: u.id,
        }))
    }, [activeUsers])

    const teacherValue = useMemo(() => {
        const teacher = activeUsers.find(u => u.id === teacherId)
        if (!teacher) return activeUsersOptions[0]
        return { label: teacher.name, value: teacher.id }
    }, [teacherId, activeUsers])

    return (
        <CompletSelect
            label='Profesor'
            name='teacher_id'
            options={activeUsersOptions}
            icon={UserIcon}
            value={teacherValue}
            onChange={e => setTeacherId(e?.value!)}
            error={error}
        />
    )
}

export function SubjectInput() {
    const [subjectId, setSubjectId] = useAtom(subjectIdAtom)
    const error = useAtomValue(errorSubjectIdAtom)
    const { subjects } = useSubjects()

    const subjectsOptions = useMemo(() => {
        return subjects.map(s => ({
            label: s.name,
            value: s.id,
        }))
    }, [subjects])

    const subjectValue = useMemo(() => {
        const subject = subjects.find(s => s.id === subjectId)
        if (!subject) return subjectsOptions[0]
        return { label: subject.name, value: subject.id }
    }, [subjectId, subjects])

    return (
        <CompletSelect
            label='Tema'
            name='subject_id'
            options={subjectsOptions}
            icon={BookAIcon}
            value={subjectValue}
            onChange={e => setSubjectId(e?.value!)}
            error={error}
        />
    )
}

export function CareerInput() {
    const [careerId, setCareerId] = useAtom(careerIdAtom)
    const error = useAtomValue(errorCareerIdAtom)
    const { careers } = useCareers()

    const careersOptions = useMemo(() => {
        return careers.map(c => ({
            label: c.name,
            value: c.id,
        }))
    }, [careers])

    const careerValue = useMemo(() => {
        const career = careers.find(c => c.id === careerId)
        if (!career) return careersOptions[0]
        return { label: career.name, value: career.id }
    }, [careerId, careers])

    return (
        <CompletSelect
            label='Carrera'
            name='career_id'
            options={careersOptions}
            icon={GraduationCapIcon}
            value={careerValue}
            onChange={e => setCareerId(e?.value!)}
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
