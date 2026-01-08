'use client'

import { useAtom, useAtomValue } from 'jotai'
import { startTransition, use, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { archiveLaboratory } from '@/actions/laboratories.actions'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useRouter } from 'next/navigation'
import { SearchLaboratoriesContext } from '@/contexts/laboratories.context'
import { LABORATORY_TYPE } from '@/prisma/generated/enums'
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

export function ArchiveDialog() {
    const t = useTranslations('laboratories')
    const tCommon = useTranslations('common')
    const [open, setOpen] = useAtom(dialogAtom)
    const entityId = useAtomValue(selectedIdAtom)
    const router = useRouter()
    const { refresh, promise } = use(SearchLaboratoriesContext)
    const { laboratories } = use(promise)

    const entity = useMemo(() => {
        return laboratories?.find(l => l.id === entityId)
    }, [laboratories, entityId])

    const onAction = useCallback(async () => {
        if (!entityId) return
        startTransition(async () => {
            const response = await archiveLaboratory(entityId)
            setOpen(null)
            if (response.status === 'success') {
                return refresh()
            }
            if (response.type === 'not-found') {
                refresh()
            } else if (response.type === 'permission') {
                toastPermissionError(response.missings)
            } else if (response.type === 'unauthorized') {
                router.replace('/login')
            } else if (response.type === 'unexpected') {
                toastGenericError()
            }
        })
    }, [entityId, refresh, setOpen, router])

    const info = useMemo(
        () =>
            !entity ?
                ({} as Record<string, string | number>)
            :   {
                    [t('name_label')]: entity.name,
                    [t('type_label')]:
                        entity.type === LABORATORY_TYPE.LABORATORY ?
                            t('laboratory_type')
                        :   t('computer_center_type'),
                    [t('opening')]: entity.open_hour,
                    [t('closing')]: entity.close_hour,
                },
        [entity, t],
    )

    if (!entity) return null

    return (
        <AlertDialog
            open={open === 'ARCHIVE'}
            onOpenChange={state => setOpen(state ? 'ARCHIVE' : null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('archive_title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('archive_confirmation')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <TableList info={info} />
                <AlertDialogFooter>
                    <AlertDialogCancel>{tCommon('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={onAction}>
                        {tCommon('continue')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
