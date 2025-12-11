'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Archive, Ban, User as UserIcon } from 'lucide-react'
import {
    Activity,
    Suspense,
    use,
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
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchClassesContext } from '@/contexts/classes.context'

function ArchiveDialog() {
    const [open, openDialog] = useAtom(dialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entityId = useAtomValue(selectedIdAtom)
    const [message, setMessage] = useState('')
    const t = useTranslations('classes')
    const router = useRouter()
    const { promise, refresh } = use(SearchClassesContext)
    const { classes } = use(promise)

    const entity = useMemo(
        () => classes.find(c => c.id === entityId),
        [classes, entityId],
    )

    const onAction = useCallback(() => {
        if (!entityId) return
        startTransition(async () => {
            const res = await archiveClass(entityId)
            if (res.status === 'success') {
                openDialog(null)
                refresh()
                return
            }
            if (res.type === 'not-found') {
                refresh()
                openDialog(null)
            } else if (res.type === 'permission') {
                setMessage(res.message)
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                setMessage('Ha ocurrido un error inesperado, intente mas tarde')
            }
        })
    }, [entityId, openDialog, router, refresh])

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
        <Suspense>
            <ArchiveDialog />
        </Suspense>
    )
}

export { SuspenseArchiveDialog as ArchiveDialog }
