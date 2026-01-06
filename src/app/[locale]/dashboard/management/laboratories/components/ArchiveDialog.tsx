'use client'

import { useAtom, useAtomValue } from 'jotai'
import { startTransition, use, useCallback, useMemo } from 'react'
import { archiveLaboratory } from '@/actions/laboratories.actions'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useRouter } from 'next/navigation'
import { SearchLaboratoriesContext } from '@/contexts/laboratories.context'
import { LABORATORY_TYPE } from '@/prisma/generated/enums'
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

export function ArchiveDialog() {
    const [open, setOpen] = useAtom(dialogAtom)
    const entityId = useAtomValue(selectedIdAtom)
    const router = useRouter()
    const { refresh, promise } = use(SearchLaboratoriesContext)
    const { laboratories } = use(promise)

    const entity = useMemo(() => {
        return laboratories?.find(l => l.id === entityId)
    }, [laboratories, entityId])

    const onAction = useCallback(async () => {
        if (!entityId) return
        startTransition(async () => {
            const response = await archiveLaboratory(entityId)
            setOpen(null)
            if (response.status === 'success') {
                return refresh()
            }
            if (response.type === 'not-found') {
                refresh()
            } else if (response.type === 'permission') {
                toastPermissionError(response.missings)
            } else if (response.type === 'unauthorized') {
                router.replace('/login')
            } else if (response.type === 'unexpected') {
                toastGenericError()
            }
        })
    }, [entityId, refresh, setOpen, router])

    const info = useMemo(
        () =>
            !entity ?
                ({} as Record<string, string | number>)
            :   {
                    Nombre: entity.name,
                    'Tipo de Laboratorio':
                        entity.type === LABORATORY_TYPE.LABORATORY ?
                            'Laboratorio'
                        :   'Centro de Cómputo',
                    'Horario de Apertura': entity.open_hour,
                    'Horario de Cierre': entity.close_hour,
                },
        [entity],
    )

    if (!entity) return null

    return (
        <AlertDialog
            open={open === 'ARCHIVE'}
            onOpenChange={state => setOpen(state ? 'ARCHIVE' : null)}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Archivar Laboratorio</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de archivar este laboratorio?
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
