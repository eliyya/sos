'use client'

import { useAtom, useAtomValue } from 'jotai'
import { startTransition, Suspense, use, useCallback, useMemo } from 'react'
import { maintainanceMachine } from '@/actions/machines.actions'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchMachinesContext } from '@/contexts/machines.context'
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

function ArchiveDialog() {
    const [dialogOpened, openDialog] = useAtom(dialogAtom)
    const entityId = useAtomValue(selectedIdAtom)
    const router = useRouter()
    const { refresh, promise } = use(SearchMachinesContext)

    const { machines } = use(promise)

    const entity = useMemo(() => {
        return machines.find(m => m.id === entityId)
    }, [machines, entityId])

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const res = await maintainanceMachine(entity.id)
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
    }, [entity, openDialog, router, refresh])

    const info = useMemo(
        () =>
            !entity ?
                ({} as Record<string, string | number>)
            :   {
                    Número: entity.number,
                    Procesador: entity.processor,
                    RAM: entity.ram,
                    Almacenamiento: entity.storage,
                    Serie: entity?.serie ?? '',
                },
        [entity],
    )

    if (!entity) return null

    return (
        <AlertDialog
            open={dialogOpened === 'ARCHIVE'}
            onOpenChange={state => openDialog(state ? 'ARCHIVE' : null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Poner en mantenimiento</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de poner esta máquina en mantenimiento?
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

function SuspenseArchiveDialog() {
    return (
        <Suspense>
            <ArchiveDialog />
        </Suspense>
    )
}

export { SuspenseArchiveDialog as ArchiveDialog }
