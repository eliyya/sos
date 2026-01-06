'use client'

import { useAtom, useAtomValue } from 'jotai'
import { startTransition, Suspense, use, useCallback, useMemo } from 'react'
import { unarchiveCareer } from '@/actions/careers.actions'
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

function UnarchiveDialog() {
    const [open, openDialog] = useAtom(dialogAtom)
    const entityId = useAtomValue(selectedIdAtom)
    const t = useTranslations('career')
    const router = useRouter()
    const { refresh, promise } = use(SearchCareersContext)
    const { careers } = use(promise)

    const entity = useMemo(
        () => careers.find(c => c.id === entityId),
        [careers, entityId],
    )

    const onAction = useCallback(() => {
        if (!entityId) return
        startTransition(async () => {
            const response = await unarchiveCareer(entityId)
            openDialog(null)
            if (response.status === 'success') {
                return refresh()
            }
            if (response.type === 'permission') {
                toastPermissionError(response.missings)
            } else if (response.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (response.type === 'not-found') {
                refresh()
            } else {
                toastGenericError()
            }
        })
    }, [entityId, refresh, openDialog, router])

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
            open={open === 'UNARCHIVE'}
            onOpenChange={state => openDialog(state ? 'UNARCHIVE' : null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('unarchive_career')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('confirm_unarchive', { 'entity.name': entity.name })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <TableList info={info} />
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancell')}</AlertDialogCancel>
                    <AlertDialogAction onClick={onAction}>
                        {t('unarchive')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

function SuspenseUnarchiveDialog() {
    return (
        <Suspense>
            <UnarchiveDialog />
        </Suspense>
    )
}

export { SuspenseUnarchiveDialog as UnarchiveDialog }
