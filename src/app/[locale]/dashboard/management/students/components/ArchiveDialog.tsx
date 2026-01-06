'use client'

import { useAtom, useAtomValue } from 'jotai'
import { startTransition, Suspense, use, useCallback, useMemo } from 'react'
import { archiveStudent } from '@/actions/students.actions'
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

function ArchiveDialog() {
    const [open, openDialog] = useAtom(dialogAtom)
    const entityNc = useAtomValue(selectedIdAtom)
    // TODO: Add students translations
    // const t = useTranslations('students')
    const router = useRouter()
    const { refresh, promise } = use(SearchStudentsContext)
    const { students } = use(promise)

    const entity = useMemo(() => {
        return students.find(student => student.nc === entityNc)
    }, [students, entityNc])

    const onAction = useCallback(() => {
        if (!entityNc) return
        startTransition(async () => {
            const res = await archiveStudent(entityNc)
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
            open={open === 'ARCHIVE'}
            onOpenChange={status => {
                if (!status) {
                    openDialog(null)
                }
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Archivar Estudiante</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de archivar a este estudiante?
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
