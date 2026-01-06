'use client'

import { useAtom, useAtomValue } from 'jotai'
import { startTransition, Suspense, use, useCallback, useMemo } from 'react'
import { unarchiveSubject } from '@/actions/subjects.actions'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import app from '@eliyya/type-routes'
import { useRouter } from 'next/navigation'
import { SearchSubjectsContext } from '@/contexts/subjects.context'
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
    const { refresh, promise } = use(SearchSubjectsContext)
    const router = useRouter()
    const { subjects } = use(promise)

    const entity = useMemo(() => {
        return subjects?.find(subject => subject.id === entityId)
    }, [subjects, entityId])

    const onAction = useCallback(async () => {
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
            open={open === 'UNARCHIVE'}
            onOpenChange={state => openDialog(state ? 'UNARCHIVE' : null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Desarchivar Asignatura</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de desarchivar la asignatura{' '}
                        <strong>{entity.name}</strong>?
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
