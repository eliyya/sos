'use client'

import { useAtom, useAtomValue } from 'jotai'
import { startTransition, use, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { deleteUserAction } from '@/actions/users.actions'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useRoles } from '@/hooks/roles.hooks'
import { DEFAULT_ROLES } from '@/constants/client'
import { SearchUsersContext } from '@/contexts/users.context'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
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

export function DeleteEntityDialog() {
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

    const onAction = useCallback(() => {
        if (!entityId) return
        startTransition(async () => {
            const res = await deleteUserAction(entityId)
            setOpen(null)
            if (res.status === 'success') {
                return refresh()
            }
            if (res.type === 'not-allowed') {
                if (res.message === 'users.cannot_delete_unique_admin') {
                    setOpen('PREVENT_ARCHIVE_ADMIN')
                } else {
                    toastGenericError()
                }
            } else if (res.type === 'not-found') {
                refresh()
            } else if (res.type === 'permission') {
                toastPermissionError(res.missings)
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                toastGenericError()
            }
        })
    }, [entityId, setOpen, refresh, router])

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
            open={open === 'DELETE'}
            onOpenChange={state => setOpen(state ? 'DELETE' : null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('delete_title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('delete_confirmation', { name: entity.name })}
                        <strong>{tc('irreversible_action')}</strong>
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
