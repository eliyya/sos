'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Ban, Trash2, User as UserIcon } from 'lucide-react'
import {
    Activity,
    Suspense,
    use,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
import { deleteClass } from '@/actions/classes.actions'
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
import { openDialogAtom, selectedClassIdAtom } from '@/global/classes.globals'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchClassesContext } from '@/contexts/classes.context'

function DeleteDialog() {
    const [open, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entityId = useAtomValue(selectedClassIdAtom)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const { classesPromise, refreshClasses } = use(SearchClassesContext)
    const { classes } = use(classesPromise)

    const entity = useMemo(
        () => classes.find(c => c.id === entityId),
        [classes, entityId],
    )

    const onAction = useCallback(() => {
        if (!entityId) return
        startTransition(async () => {
            const res = await deleteClass(entityId)
            if (res.status === 'success') {
                refreshClasses()
                openDialog(null)
                return
            }
            if (res.type === 'not-found') {
                refreshClasses()
                openDialog(null)
            } else if (res.type === 'permission') {
                setMessage('No tienes permiso para eliminar esta estudiante')
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                setMessage('Ha ocurrido un error inesperado, intente mas tarde')
            }
        })
    }, [entityId, refreshClasses, openDialog, router])

    const t = useTranslations('classes')

    if (!entity) return null

    return (
        <Dialog
            open={open === 'DELETE'}
            onOpenChange={state => openDialog(state ? 'DELETE' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('delete_class')}</DialogTitle>
                    <DialogDescription>
                        {t('confirm_delete_class', {
                            subjectName: entity.subject.displayname,
                            teacherName: entity.teacher.displayname,
                        })}{' '}
                        <strong>{t('is_irreversible')}</strong>
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
                        label={t('teacher')}
                        disabled
                        value={entity.teacher.displayname}
                        icon={UserIcon}
                    />
                    <CompletInput
                        label={t('subject')}
                        disabled
                        value={entity.subject.displayname}
                        icon={UserIcon}
                    />
                    <CompletInput
                        label={t('career')}
                        disabled
                        value={entity.career.displayname}
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
                            <Trash2 className='mr-2 h-5 w-5' />
                            {t('delete')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function SuspenseDeleteDialog() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DeleteDialog />
        </Suspense>
    )
}

export { SuspenseDeleteDialog as DeleteDialog }
