'use client'

import { useAtom, useAtomValue } from 'jotai'
import { startTransition, use, useCallback, useMemo } from 'react'
import { unarchiveUserAction } from '@/actions/users.actions'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
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

export function UnarchiveEntityDialog() {
    const [open, setOpen] = useAtom(dialogAtom)
    const entityId = useAtomValue(selectedIdAtom)
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
            const response = await unarchiveUserAction(entityId)
            setOpen(null)
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
    }, [entityId, setOpen, refresh, router])

    const info = useMemo(
        () =>
            !entity ?
                ({} as Record<string, string | number>)
            :   {
                    Nombre: entity.name,
                    Usuario: entity.username,
                    Rol: entity.role.name,
                },
        [entity],
    )

    if (!entity) return null

    return (
        <AlertDialog
            open={open === 'UNARCHIVE'}
            onOpenChange={op => setOpen(op ? 'UNARCHIVE' : null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Desarchivar Usuario</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de desarchivar al usuario {entity.name}?
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
