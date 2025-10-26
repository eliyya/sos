'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    ArchiveRestoreIcon,
    BanIcon,
    BookAIcon,
    GraduationCapIcon,
    HashIcon,
    TrashIcon,
    UserIcon,
    UsersIcon,
} from 'lucide-react'
import { Activity, useCallback, useMemo, useState, useTransition } from 'react'
import { unarchiveClass } from '@/actions/classes.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { openDialogAtom, selectedClassAtom } from '@/global/classes.globals'
import { useUsers } from '@/hooks/users.hooks'
import { useTranslations } from 'next-intl'
import { useCareers } from '@/hooks/careers.hooks'
import { useSubjects } from '@/hooks/subjects.hooks'
import { useRouter } from 'next/navigation'
import { STATUS } from '@/prisma/generated/enums'
import { useClasses } from '@/hooks/classes.hooks'
import app from '@eliyya/type-routes'
import { CompletInput } from '@/components/Inputs'

export function UnarchiveOrDeleteDialog() {
    const [open, setOpen] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedClassAtom)
    const [message, setMessage] = useState('')
    const t = useTranslations('classes')
    const { users } = useUsers()
    const { careers } = useCareers()
    const { subjects } = useSubjects()
    const { refetchClasses, setClasses } = useClasses()
    const router = useRouter()

    const subject = useMemo(() => {
        if (!entity) return ''
        const subject = subjects.find(s => s.id === entity.subject_id)
        if (!subject) return 'Deleted Subject'
        if (subject.status === STATUS.ARCHIVED)
            return `(Archived) ${subject.name}`
        return subject.name
    }, [entity, subjects])

    const career = useMemo(() => {
        if (!entity) return ''
        const career = careers.find(c => c.id === entity.career_id)
        if (!career) return 'Deleted Career'
        if (career.status === STATUS.ARCHIVED)
            return `(Archived) ${career.alias}`
        return career.alias
    }, [entity, careers])

    const teacher = useMemo(() => {
        if (!entity) return ''
        const teacher = users.find(u => u.id === entity.teacher_id)
        if (!teacher) return 'Deleted Teacher'
        if (teacher.status === STATUS.ARCHIVED)
            return `(Archived) ${teacher.name}`
        return teacher.name
    }, [entity, users])

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const res = await unarchiveClass(entity.id)
            if (res.status === 'success') {
                setOpen(null)
                setClasses(prev =>
                    prev.map(c => (c.id === entity.id ? res.class : c)),
                )
                return
            }
            if (res.type === 'not-found') {
                refetchClasses()
                setOpen(null)
            } else if (res.type === 'permission') {
                setMessage(res.message)
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                setMessage('Ha ocurrido un error inesperado, intente mas tarde')
            }
        })
    }, [entity, setOpen, router])

    if (!entity) return null

    return (
        <Dialog
            open={open === 'UNARCHIVE_OR_DELETE'}
            onOpenChange={status =>
                setOpen(status ? 'UNARCHIVE_OR_DELETE' : null)
            }
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('archived_class')}</DialogTitle>
                    <DialogDescription>
                        {t('unarchived_or_delete_description', {
                            subject_name: subject,
                            career: career,
                            group: entity.group + '',
                            semester: entity.semester + '',
                            teacher: teacher,
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
                    <CompletInput
                        label={t('group')}
                        disabled
                        value={entity.group + ''}
                        icon={UsersIcon}
                    />
                    <CompletInput
                        label={t('semester')}
                        disabled
                        value={entity.semester + ''}
                        icon={HashIcon}
                    />
                    <CompletInput
                        label={t('teacher')}
                        disabled
                        value={teacher}
                        icon={UserIcon}
                    />
                    <CompletInput
                        label={t('subject')}
                        disabled
                        value={subject}
                        icon={BookAIcon}
                    />
                    <CompletInput
                        label={t('career')}
                        disabled
                        value={career}
                        icon={GraduationCapIcon}
                    />
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            type='button'
                            variant='secondary'
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                setOpen(null)
                            }}
                        >
                            <BanIcon className='mr-2 h-5 w-5' />
                            {t('cancel')}
                        </Button>
                        <Button
                            type='submit'
                            variant='default'
                            disabled={inTransition}
                        >
                            <ArchiveRestoreIcon className='mr-2 h-5 w-5' />
                            {t('unarchive')}
                        </Button>
                        <Button
                            type='button'
                            variant='destructive'
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                setOpen('DELETE')
                            }}
                        >
                            <TrashIcon className='mr-2 h-5 w-5' />
                            {t('delete')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
