'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
    BookAIcon,
    GraduationCapIcon,
    HashIcon,
    Save,
    UserIcon,
    UsersIcon,
} from 'lucide-react'
import { Activity, useCallback, useMemo, useState, useTransition } from 'react'
import { editClass } from '@/actions/classes.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { useTranslations } from 'next-intl'
import { RetornableCompletInput } from '@/components/Inputs'
import {
    RetornableCompletAsyncSelect,
    RetornableCompletSelect,
} from '@/components/Select'
import {
    openDialogAtom,
    selectedClassAtom,
    usersSelectOptionsAtom,
} from '@/global/classes.globals'
import { useCareers } from '@/hooks/careers.hooks'
import { useSubjects } from '@/hooks/subjects.hooks'
import { useClasses } from '@/hooks/classes.hooks'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { STATUS } from '@/prisma/generated/enums'
import { searchUsers } from '@/actions/users.actions'

export function EditDialog() {
    const t = useTranslations('classes')
    const [open, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(selectedClassAtom)
    const [message, setMessage] = useState('')
    const { careers, activeCareers } = useCareers()
    const { subjects, activeSubjects } = useSubjects()
    const { refetchClasses } = useClasses()
    const router = useRouter()
    const [usersSelectOptions, setUsersSelectOptions] = useAtom(
        usersSelectOptionsAtom,
    )

    const subjectsOptions = useMemo(() => {
        return activeSubjects.map(s => ({
            label: s.name,
            value: s.id,
        }))
    }, [activeSubjects])

    const careersOptions = useMemo(() => {
        return activeCareers.map(c => ({
            label: c.name,
            value: c.id,
        }))
    }, [activeCareers])

    const originalCareer = useMemo(() => {
        if (!old) return null
        const career = careers.find(c => c.id === old.career_id)
        if (!career) return { label: 'Deleted Career', value: old.career_id }
        if (career.status === STATUS.ARCHIVED)
            return { label: `(Archived) ${career.alias}`, value: career.id }
        return { label: career.alias, value: career.id }
    }, [old, careers])

    const originalSubject = useMemo(() => {
        if (!old) return null
        const subject = subjects.find(s => s.id === old.subject_id)
        if (!subject) return { label: 'Deleted Subject', value: old.subject_id }
        if (subject.status === STATUS.ARCHIVED)
            return { label: `(Archived) ${subject.name}`, value: subject.id }
        return { label: subject.name, value: subject.id }
    }, [old, subjects])

    const originalTeacher = useMemo(() => {
        if (!old) return null
        return { label: old.teacher.displayname, value: old.teacher_id }
    }, [old])

    const onAction = useCallback(
        (formData: FormData) => {
            if (!old) return
            const career_id = formData.get('career_id') as string
            const group = Number(formData.get('group'))
            const semester = Number(formData.get('semester'))
            const subject_id = formData.get('subject_id') as string
            const teacher_id = formData.get('teacher_id') as string

            startTransition(async () => {
                const res = await editClass({
                    career_id,
                    group,
                    id: old.id,
                    semester,
                    subject_id,
                    teacher_id,
                })
                if (res.status === 'success') {
                    refetchClasses()
                    openDialog(null)
                    return
                } else if (res.type === 'not-found') {
                    refetchClasses()
                    openDialog(null)
                } else if (res.type === 'permission') {
                    setMessage('No tienes permiso para editar esta máquina')
                } else if (res.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (res.type === 'unexpected') {
                    setMessage(
                        'Ha ocurrido un error inesperado, intente mas tarde',
                    )
                }
            })
        },
        [old, openDialog, router, refetchClasses],
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

    if (!old) return null

    return (
        <Dialog
            open={open === 'EDIT'}
            onOpenChange={state => openDialog(state ? 'EDIT' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('edit_class', {
                            subject: originalCareer?.label ?? '',
                            career: originalCareer?.label ?? '',
                            group: old.group + '',
                        })}
                    </DialogTitle>
                    <DialogDescription>
                        {t('edit_class', {
                            subject: originalSubject?.label ?? '',
                            career: originalCareer?.label ?? '',
                            group: old.group + '',
                        })}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <RetornableCompletAsyncSelect
                        originalValue={originalTeacher}
                        label={t('teacher')}
                        name='teacher_id'
                        loadOptions={loadOptions}
                        defaultOptions={usersSelectOptions}
                        icon={UserIcon}
                    />
                    <RetornableCompletSelect
                        originalValue={originalSubject}
                        label={t('subject')}
                        name='subject_id'
                        options={subjectsOptions}
                        icon={BookAIcon}
                    />
                    <RetornableCompletSelect
                        originalValue={originalCareer}
                        label={t('career')}
                        name='career_id'
                        options={careersOptions}
                        icon={GraduationCapIcon}
                    />
                    <RetornableCompletInput
                        label={t('group')}
                        name='group'
                        icon={UsersIcon}
                        type='number'
                        min={0}
                        originalValue={old.group}
                    />
                    <RetornableCompletInput
                        label={t('semester')}
                        name='semester'
                        icon={HashIcon}
                        type='number'
                        min={0}
                        originalValue={old.semester}
                    />
                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        {t('save')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
