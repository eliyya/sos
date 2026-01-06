'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArchiveRestoreIcon, BanIcon, TrashIcon } from 'lucide-react'
import { startTransition, Suspense, use, useCallback, useMemo } from 'react'
import { availableMachine } from '@/actions/machines.actions'
import { Button } from '@/components/ui/button'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchMachinesContext } from '@/contexts/machines.context'
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

function UnarchiveOrDeleteDialog() {
    const [open, openDialog] = useAtom(dialogAtom)
    const entityId = useAtomValue(selectedIdAtom)
    const { refresh, promise } = use(SearchMachinesContext)
    const router = useRouter()

    const { machines } = use(promise)

    const entity = useMemo(() => {
        return machines.find(m => m.id === entityId)
    }, [machines, entityId])

    const onUnarchive = useCallback(() => {
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
            open={open === 'UNARCHIVE_OR_DELETE'}
            onOpenChange={state =>
                openDialog(state ? 'UNARCHIVE_OR_DELETE' : null)
            }
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Máquina en mantenimiento
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        La máquina #{entity.number} con serie {entity.serie}{' '}
                        está en mantenimiento. ¿Qué desea hacer?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <TableList info={info} />
                <AlertDialogFooter className='flex-col gap-2 sm:flex-row'>
                    <Button
                        variant='outline'
                        onClick={() => openDialog(null)}
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
                        Disponible
                    </Button>
                    <Button
                        variant='destructive'
                        onClick={() => openDialog('DELETE')}
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

function SuspenseUnarchiveOrDeleteDialog() {
    return (
        <Suspense>
            <UnarchiveOrDeleteDialog />
        </Suspense>
    )
}

export { SuspenseUnarchiveOrDeleteDialog as UnarchiveOrDeleteDialog }
