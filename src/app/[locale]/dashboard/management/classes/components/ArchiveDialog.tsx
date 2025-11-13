'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Archive, Ban, User as UserIcon } from 'lucide-react'
import {
    Activity,
    Suspense,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
import { archiveClass } from '@/actions/classes.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { CompletInput } from '@/components/Inputs'
import { openDialogAtom, selectedClassAtom } from '@/global/classes.globals'
import { useTranslations } from 'next-intl'
import { useCareers } from '@/hooks/careers.hooks'
import { useSubjects } from '@/hooks/subjects.hooks'
import { useRouter } from 'next/navigation'
import { useClasses } from '@/hooks/classes.hooks'
import app from '@eliyya/type-routes'
import { STATUS } from '@/prisma/generated/enums'

function ArchiveDialog() {
    const [open, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedClassAtom)
    const [message, setMessage] = useState('')
    const { subjects } = useSubjects()
    const { careers } = useCareers()
    const t = useTranslations('classes')
    const { refetchClasses } = useClasses()
    const router = useRouter()

    const subject = useMemo(() => {
        if (!entity) return ''
        const subject = subjects.find(s => s.id === entity.subject_id)
        if (!subject) return 'Deleted subject'
        if (subject.status === STATUS.ARCHIVED)
            return `(Archived) ${subject.name}`
        return subject.name
    }, [entity, subjects])

    const career = useMemo(() => {
        if (!entity) return ''
        const career = careers.find(c => c.id === entity.career_id)
        if (!career) return 'Deleted career'
        if (career.status === STATUS.ARCHIVED)
            return `(Archived) ${career.name}`
        return career.name
    }, [entity, careers])

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const res = await archiveClass(entity.id)
            if (res.status === 'success') {
                openDialog(null)
                refetchClasses()
                return
            }
            if (res.type === 'not-found') {
                refetchClasses()
                openDialog(null)
            } else if (res.type === 'permission') {
                setMessage(res.message)
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                setMessage('Ha ocurrido un error inesperado, intente mas tarde')
            }
        })
    }, [entity, openDialog, router, refetchClasses])

    if (!entity) return null

    return (
        <Dialog
            open={open === 'ARCHIVE'}
            onOpenChange={state => openDialog(state ? 'ARCHIVE' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('archive_class')}</DialogTitle>
                    <DialogDescription>
                        {t('confirm_archive')}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    {/* TODO: implement this for all managements */}
                    <CompletInput
                        label={t('teacher')}
                        disabled
                        value={entity.teacher.displayname}
                        icon={UserIcon}
                    />
                    <CompletInput
                        label={t('subject')}
                        disabled
                        value={subject}
                        icon={UserIcon}
                    />
                    <CompletInput
                        label={t('career')}
                        disabled
                        value={career}
                        icon={UserIcon}
                    />
                    <CompletInput
                        label={t('group')}
                        icon={UserIcon}
                        type='number'
                        disabled
                        value={entity.group}
                    />
                    <CompletInput
                        label={t('semester')}
                        icon={UserIcon}
                        type='number'
                        disabled
                        value={entity.semester}
                    />
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                openDialog(null)
                            }}
                        >
                            <Ban className='mr-2 h-5 w-5' />
                            {t('cancel')}
                        </Button>
                        <Button
                            type='submit'
                            variant={'destructive'}
                            disabled={inTransition}
                        >
                            <Archive className='mr-2 h-5 w-5' />
                            {t('archive')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function SuspenseArchiveDialog() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ArchiveDialog />
        </Suspense>
    )
}

export { SuspenseArchiveDialog as ArchiveDialog }
