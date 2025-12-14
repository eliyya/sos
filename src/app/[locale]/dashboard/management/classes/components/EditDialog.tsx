'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
    BookAIcon,
    GraduationCapIcon,
    HashIcon,
    SaveIcon,
    UserIcon,
    UsersIcon,
} from 'lucide-react'
import {
    Activity,
    Suspense,
    use,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
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
import { RetornableCompletAsyncSelect } from '@/components/Select'
import {
    careersSelectOptionsAtom,
    dialogAtom,
    selectedIdAtom,
    subjectsSelectOptionsAtom,
    usersSelectOptionsAtom,
} from '@/global/management.globals'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { searchUsers, searchSubjects } from '@/actions/search.actions'
import { SearchClassesContext } from '@/contexts/classes.context'

function EditDialog() {
    const t = useTranslations('classes')
    const [open, openDialog] = useAtom(dialogAtom)
    const [inTransition, startTransition] = useTransition()
    const oldId = useAtomValue(selectedIdAtom)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const { refresh, promise } = use(SearchClassesContext)
    const { classes } = use(promise)

    const old = useMemo(() => {
        return classes.find(c => c.id === oldId)
    }, [classes, oldId])

    const onAction = useCallback(
        (formData: FormData) => {
            if (!oldId) return
            const career_id = formData.get('career_id') as string
            const group = Number(formData.get('group'))
            const semester = Number(formData.get('semester'))
            const subject_id = formData.get('subject_id') as string
            const teacher_id = formData.get('teacher_id') as string

            startTransition(async () => {
                const res = await editClass({
                    career_id,
                    group,
                    id: oldId,
                    semester,
                    subject_id,
                    teacher_id,
                })
                if (res.status === 'success') {
                    refresh()
                    openDialog(null)
                    return
                } else if (res.type === 'not-found') {
                    refresh()
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
        [oldId, refresh, openDialog, router],
    )

    if (!old) return null

    return (
        <Dialog
            open={open === 'EDIT'}
            onOpenChange={state => openDialog(state ? 'EDIT' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('edit_class')}</DialogTitle>
                    <DialogDescription>
                        {t('edit_class_description', {
                            subject: old.subject.displayname,
                            career: old.career.displayname,
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
                    <TeacherSelect />
                    <SubjectSelect />
                    <CareerSelect />
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
                        <SaveIcon className='mr-2 h-5 w-5' />
                        {t('save')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function SuspenseEditDialog() {
    return (
        <Suspense>
            <EditDialog />
        </Suspense>
    )
}

export { SuspenseEditDialog as EditDialog }

function TeacherSelect() {
    const t = useTranslations('classes')
    const [usersSelectOptions, setUsersSelectOptions] = useAtom(
        usersSelectOptionsAtom,
    )
    const classId = useAtomValue(selectedIdAtom)
    const { promise } = use(SearchClassesContext)
    const { classes } = use(promise)
    const originalTeacher = useMemo(() => {
        const class_ = classes.find(c => c.id === classId)
        if (!class_) return null
        return {
            label: class_.teacher.displayname,
            value: class_.teacher_id,
        }
    }, [classes, classId])
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
        <RetornableCompletAsyncSelect
            originalValue={originalTeacher}
            label={t('teacher')}
            name='teacher_id'
            loadOptions={loadOptions}
            defaultOptions={usersSelectOptions}
            icon={UserIcon}
        />
    )
}

function SubjectSelect() {
    const t = useTranslations('classes')
    const classId = useAtomValue(selectedIdAtom)
    const { promise } = use(SearchClassesContext)
    const { classes } = use(promise)
    const [subjectsSelectOptions, setSubjectsSelectOptions] = useAtom(
        subjectsSelectOptionsAtom,
    )
    const originalSubject = useMemo(() => {
        const class_ = classes.find(c => c.id === classId)
        if (!class_) return null
        return {
            label: class_.subject.displayname,
            value: class_.subject_id,
        }
    }, [classes, classId])
    const loadOptions = useCallback(
        (
            inputValue: string,
            callback: (options: { label: string; value: string }[]) => void,
        ) => {
            searchSubjects({
                query: inputValue,
            }).then(res => {
                const options = res.subjects.map(s => ({
                    label: s.name,
                    value: s.id,
                }))
                setSubjectsSelectOptions(options)
                callback(options)
            })
        },
        [setSubjectsSelectOptions],
    )
    return (
        <RetornableCompletAsyncSelect
            originalValue={originalSubject}
            label={t('subject')}
            name='subject_id'
            loadOptions={loadOptions}
            defaultOptions={subjectsSelectOptions}
            icon={BookAIcon}
        />
    )
}

function CareerSelect() {
    const t = useTranslations('classes')
    const classId = useAtomValue(selectedIdAtom)
    const { promise } = use(SearchClassesContext)
    const { classes } = use(promise)
    const [careersSelectOptions, setCareersSelectOptions] = useAtom(
        careersSelectOptionsAtom,
    )
    const originalCareer = useMemo(() => {
        const class_ = classes.find(c => c.id === classId)
        if (!class_) return null
        return {
            label: class_.career.displayname,
            value: class_.career_id,
        }
    }, [classes, classId])
    const loadOptions = useCallback(
        (
            inputValue: string,
            callback: (options: { label: string; value: string }[]) => void,
        ) => {
            searchSubjects({
                query: inputValue,
            }).then(res => {
                const options = res.subjects.map(s => ({
                    label: s.name,
                    value: s.id,
                }))
                setCareersSelectOptions(options)
                callback(options)
            })
        },
        [setCareersSelectOptions],
    )
    return (
        <RetornableCompletAsyncSelect
            originalValue={originalCareer}
            label={t('career')}
            name='career_id'
            loadOptions={loadOptions}
            defaultOptions={careersSelectOptions}
            icon={GraduationCapIcon}
        />
    )
}
