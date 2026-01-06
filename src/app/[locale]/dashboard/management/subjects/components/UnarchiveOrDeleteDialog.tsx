'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArchiveRestoreIcon, BanIcon, TrashIcon } from 'lucide-react'
import { startTransition, Suspense, use, useCallback, useMemo } from 'react'
import { unarchiveSubject } from '@/actions/subjects.actions'
import { Button } from '@/components/ui/button'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import app from '@eliyya/type-routes'
import { useRouter } from 'next/navigation'
import { SearchSubjectsContext } from '@/contexts/subjects.context'
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
    const { refresh, promise } = use(SearchSubjectsContext)
    const router = useRouter()
    const { subjects } = use(promise)

    const entity = useMemo(() => {
        return subjects?.find(subject => subject.id === entityId)
    }, [subjects, entityId])

    const onUnarchive = useCallback(async () => {
        if (!entityId) return
        startTransition(async () => {
            const res = await unarchiveSubject(entityId)
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
    }, [entityId, openDialog, refresh, router])

    const info = useMemo(
        () =>
            !entity ?
                ({} as Record<string, string | number>)
            :   {
                    Nombre: entity.name,
                    'Horas Teóricas': entity.theory_hours,
                    'Horas Prácticas': entity.practice_hours,
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
                    <AlertDialogTitle>Asignatura archivada</AlertDialogTitle>
                    <AlertDialogDescription>
                        La asignatura {entity.name} está archivada. ¿Qué desea
                        hacer con <strong>{entity.name}</strong>?
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
                        Desarchivar
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
