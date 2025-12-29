'use client'

import { useAtom, useAtomValue } from 'jotai'
import { toast } from 'sonner'
import {
    startTransition,
    Suspense,
    use,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
import { archiveClass } from '@/actions/classes.actions'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchClassesContext } from '@/contexts/classes.context'
import { TableList } from '@/components/ui/table-list'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { PermissionsBitField } from '@/bitfields/PermissionsBitField'
import { toastGenericError, toastPermissionError } from '@/components/ui/sonner'

function ArchiveDialog() {
    const [open, openDialog] = useAtom(dialogAtom)
    const entityId = useAtomValue(selectedIdAtom)
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
            openDialog(null)
            if (res.status === 'success') {
                return refresh()
            }
            if (res.type === 'not-found') {
                refresh()
            } else if (res.type === 'permission') {
                toastPermissionError(res.missings)
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                toastGenericError()
            }
        })
    }, [entityId, openDialog, router, refresh])

    const info = useMemo(
        () =>
            !entity ?
                {}
            :   {
                    [t('teacher')]: entity.teacher.displayname,
                    [t('subject')]: entity.subject.displayname,
                    [t('career')]: entity.career.display_alias,
                    [t('group')]: entity.group,
                    [t('semester')]: entity.semester,
                },
        [entity, t],
    )

    if (!entity) return null

    return (
        <AlertDialog
            open={open === 'ARCHIVE'}
            onOpenChange={state => openDialog(state ? 'ARCHIVE' : null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('archive_class')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('confirm_archive')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <TableList info={info} />
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onAction}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
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
