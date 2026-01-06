'use client'

import { useAtom, useAtomValue } from 'jotai'
import { startTransition, Suspense, use, useCallback, useMemo } from 'react'
import { availableMachine } from '@/actions/machines.actions'
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

function UnarchiveDialog() {
    const [open, openDialog] = useAtom(dialogAtom)
    const entityId = useAtomValue(selectedIdAtom)
    const { refresh, promise } = use(SearchMachinesContext)
    const router = useRouter()

    const { machines } = use(promise)

    const entity = useMemo(() => {
        return machines.find(m => m.id === entityId)
    }, [machines, entityId])

    const onAction = useCallback(() => {
        if (!entityId) return
        startTransition(async () => {
            const res = await availableMachine(entityId)
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
            open={open === 'UNARCHIVE'}
            onOpenChange={state => openDialog(state ? 'UNARCHIVE' : null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Reactivar Máquina</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de reactivar la máquina {entity.number}?
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

function SuspenseUnarchiveDialog() {
    return (
        <Suspense>
            <UnarchiveDialog />
        </Suspense>
    )
}

export { SuspenseUnarchiveDialog as UnarchiveDialog }
