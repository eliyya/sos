'use client'

import { useAtom, useAtomValue } from 'jotai'
import { startTransition, Suspense, use, useCallback, useMemo } from 'react'
import { deleteStudent } from '@/actions/students.actions'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchStudentsContext } from '@/contexts/students.context'
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

function DeleteDialog() {
    const { refresh, promise } = use(SearchStudentsContext)
    const [open, openDialog] = useAtom(dialogAtom)
    const entityNc = useAtomValue(selectedIdAtom)
    const router = useRouter()
    const { students } = use(promise)

    const entity = useMemo(() => {
        return students.find(student => student.nc === entityNc)
    }, [students, entityNc])

    const onAction = useCallback(() => {
        if (!entityNc) return
        startTransition(async () => {
            const res = await deleteStudent(entityNc)
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
            open={open === 'DELETE'}
            onOpenChange={status => openDialog(status ? 'DELETE' : null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar Estudiante</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de eliminar{' '}
                        <strong>
                            {entity.firstname} {entity.lastname}
                        </strong>
                        ?<strong>Esta acción es irreversible</strong>
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

function SuspenseDeleteDialog() {
    return (
        <Suspense>
            <DeleteDialog />
        </Suspense>
    )
}

export { SuspenseDeleteDialog as DeleteDialog }
