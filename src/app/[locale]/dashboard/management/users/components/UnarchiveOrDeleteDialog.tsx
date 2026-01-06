'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArchiveRestoreIcon, BanIcon, TrashIcon } from 'lucide-react'
import { startTransition, use, useCallback, useMemo } from 'react'
import { unarchiveUserAction } from '@/actions/users.actions'
import { Button } from '@/components/ui/button'
import { selectedIdAtom, dialogAtom } from '@/global/management.globals'
import { SearchUsersContext } from '@/contexts/users.context'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { TableList } from '@/components/ui/table-list'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toastGenericError, toastPermissionError } from '@/components/ui/sonner'

export function UnarchiveOrDeleteDialog() {
    const [open, setOpen] = useAtom(dialogAtom)
    const entityId = useAtomValue(selectedIdAtom)
    const { refresh, promise } = use(SearchUsersContext)
    const router = useRouter()
    const { users } = use(promise)

    const entity = useMemo(() => {
        if (!entityId) return null
        return users.find(user => user.id === entityId)
    }, [entityId, users])

    const onUnarchive = useCallback(() => {
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
            open={open === 'UNARCHIVE_OR_DELETE'}
            onOpenChange={op => setOpen(op ? 'UNARCHIVE_OR_DELETE' : null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Usuario archivado</AlertDialogTitle>
                    <AlertDialogDescription>
                        El usuario {entity.name} está archivado. ¿Qué desea
                        hacer con él? <strong>{entity.name}</strong>?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <TableList info={info} />
                <AlertDialogFooter className='flex-col gap-2 sm:flex-row'>
                    <Button
                        variant='outline'
                        onClick={() => setOpen(null)}
                        className='flex-1'
                    >
                        <BanIcon className='mr-2 h-5 w-5' />
                        Cancelar
                    </Button>
                    <Button
                        variant='default'
                        onClick={onUnarchive}
                        className='flex-1'
                    >
                        <ArchiveRestoreIcon className='mr-2 h-5 w-5' />
                        Desarchivar
                    </Button>
                    <Button
                        variant='destructive'
                        onClick={() => setOpen('DELETE')}
                        className='flex-1'
                    >
                        <TrashIcon className='mr-2 h-5 w-5' />
                        Eliminar
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
