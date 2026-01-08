'use client'

import { useAtom, useAtomValue } from 'jotai'
import { startTransition, use, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { archiveUserAction } from '@/actions/users.actions'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useRoles } from '@/hooks/roles.hooks'
import { DEFAULT_ROLES } from '@/constants/client'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchUsersContext } from '@/contexts/users.context'
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

export function ArchiveEntityDialog() {
    const t = useTranslations('users')
    const tc = useTranslations('common')
    const [open, setOpen] = useAtom(dialogAtom)
    const entityId = useAtomValue(selectedIdAtom)
    const { roles } = useRoles()
    const adminRole = roles.find(r => r.name === DEFAULT_ROLES.ADMIN)
    const { refresh, promise } = use(SearchUsersContext)
    const router = useRouter()
    const { users } = use(promise)

    const entity = useMemo(() => {
        if (!entityId) return null
        return users.find(user => user.id === entityId)
    }, [entityId, users])

    const onAction = useCallback(async () => {
        if (!entityId) return
        startTransition(async () => {
            const response = await archiveUserAction(entityId)
            setOpen(null)
            if (response.status === 'success') {
                return refresh()
            }
            if (response.type === 'not-allowed') {
                setOpen('PREVENT_ARCHIVE_ADMIN')
            } else if (response.type === 'not-found') {
                refresh()
            } else if (response.type === 'permission') {
                toastPermissionError(response.missings)
            } else if (response.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
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
                    [t('full_name_label')]: entity.name,
                    [t('username')]: entity.username,
                    [t('role')]: entity.role.name,
                },
        [entity, t],
    )

    if (!entity || !adminRole) return null

    return (
        <AlertDialog
            open={open === 'ARCHIVE'}
            onOpenChange={op => setOpen(op ? 'ARCHIVE' : null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('archive_title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('archive_confirmation', { name: entity.name })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <TableList info={info} />
                <AlertDialogFooter>
                    <AlertDialogCancel>{tc('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={onAction}>
                        {tc('continue')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
