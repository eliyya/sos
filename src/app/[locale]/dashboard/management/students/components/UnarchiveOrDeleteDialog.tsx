'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArchiveRestoreIcon, BanIcon, TrashIcon } from 'lucide-react'
import { startTransition, Suspense, use, useCallback, useMemo } from 'react'
import { unarchiveStudent } from '@/actions/students.actions'
import { Button } from '@/components/ui/button'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchStudentsContext } from '@/contexts/students.context'
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
    const { refresh, promise } = use(SearchStudentsContext)
    const [open, openDialog] = useAtom(dialogAtom)
    const entityNc = useAtomValue(selectedIdAtom)
    const router = useRouter()
    const { students } = use(promise)

    const entity = useMemo(() => {
        return students.find(student => student.nc === entityNc)
    }, [students, entityNc])

    const onUnarchive = useCallback(() => {
        if (!entityNc) return
        startTransition(async () => {
            const res = await unarchiveStudent(entityNc)
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
    }, [entityNc, openDialog, router, refresh])

    const info = useMemo(
        () =>
            !entity ?
                ({} as Record<string, string | number>)
            :   {
                    'Número de Control': entity.nc,
                    Nombre: `${entity.firstname} ${entity.lastname}`,
                    Semestre: entity.semester,
                    Carrera: entity.career.displayalias,
                    Grupo: entity.group,
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
                    <AlertDialogTitle>Estudiante archivado</AlertDialogTitle>
                    <AlertDialogDescription>
                        El estudiante {entity.firstname} {entity.lastname} está
                        archivado. ¿Qué desea hacer con él?
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
