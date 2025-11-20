'use client'

import { useAtom, useAtomValue } from 'jotai'
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
import {
    Activity,
    Suspense,
    use,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
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
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { CompletInput } from '@/components/Inputs'
import { SearchClassesContext } from '@/contexts/classes.context'

function UnarchiveOrDeleteDialog() {
    const [open, setOpen] = useAtom(dialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entityId = useAtomValue(selectedIdAtom)
    const [message, setMessage] = useState('')
    const t = useTranslations('classes')
    const router = useRouter()
    const { classesPromise, refreshClasses } = use(SearchClassesContext)
    const { classes } = use(classesPromise)

    const entity = useMemo(() => {
        return classes.find(c => c.id === entityId)
    }, [classes, entityId])

    const onAction = useCallback(() => {
        if (!entityId) return
        startTransition(async () => {
            const res = await unarchiveClass(entityId)
            if (res.status === 'success') {
                setOpen(null)
                refreshClasses()
                return
            }
            if (res.type === 'not-found') {
                refreshClasses()
                setOpen(null)
            } else if (res.type === 'permission') {
                setMessage(res.message)
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                setMessage('Ha ocurrido un error inesperado, intente mas tarde')
            }
        })
    }, [entityId, setOpen, refreshClasses, router])

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
                            subject_name: entity.subject.displayname,
                            career: entity.career.displayname,
                            group: entity.group + '',
                            semester: entity.semester + '',
                            teacher: entity.teacher.displayname,
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
                        value={entity.teacher.displayname}
                        icon={UserIcon}
                    />
                    <CompletInput
                        label={t('subject')}
                        disabled
                        value={entity.subject.displayname}
                        icon={BookAIcon}
                    />
                    <CompletInput
                        label={t('career')}
                        disabled
                        value={entity.career.displayname}
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

function SuspenseUnarchiveOrDeleteDialog() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UnarchiveOrDeleteDialog />
        </Suspense>
    )
}

export { SuspenseUnarchiveOrDeleteDialog as UnarchiveOrDeleteDialog }
