'use client'

import { useAtom, useAtomValue } from 'jotai'
import { startTransition, Suspense, use, useCallback, useMemo } from 'react'
import { archiveCareer } from '@/actions/careers.actions'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchCareersContext } from '@/contexts/careers.context'
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
import { toastGenericError, toastPermissionError } from '@/components/ui/sonner'

function SuspenseArchiveDialog() {
    return (
        <Suspense>
            <ArchiveDialog />
        </Suspense>
    )
}

export { SuspenseArchiveDialog as ArchiveDialog }

function ArchiveDialog() {
    const [open, openDialog] = useAtom(dialogAtom)
    const entityId = useAtomValue(selectedIdAtom)
    const t = useTranslations('career')
    const { refresh, promise } = use(SearchCareersContext)
    const { careers } = use(promise)
    const router = useRouter()

    const entity = useMemo(
        () => careers.find(c => c.id === entityId),
        [careers, entityId],
    )

    const onAction = useCallback(() => {
        startTransition(async () => {
            if (!entityId) return
            const response = await archiveCareer(entityId)
            openDialog(null)
            if (response.status === 'success') {
                return refresh()
            }
            if (response.type === 'not-found') {
                refresh()
            } else if (response.type === 'permission') {
                toastPermissionError(response.missings)
            } else if (response.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (response.type === 'unexpected') {
                toastGenericError()
            }
        })
    }, [entityId, openDialog, refresh, router])

    const info = useMemo(
        () =>
            !entity ?
                ({} as Record<string, string | number>)
            :   {
                    [t('name')]: entity.name,
                    [t('alias')]: entity.alias,
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
                    <AlertDialogTitle>{t('archive_career')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('confirm', { name: entity.name })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <TableList info={info} />
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={onAction}>
                        {t('archive')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
