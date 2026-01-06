'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArchiveRestoreIcon, BanIcon, TrashIcon } from 'lucide-react'
import { startTransition, use, useCallback, useMemo } from 'react'
import { unarchiveLaboratory } from '@/actions/laboratories.actions'
import { Button } from '@/components/ui/button'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useRouter } from 'next/navigation'
import { LABORATORY_TYPE } from '@/prisma/generated/enums'
import { SearchLaboratoriesContext } from '@/contexts/laboratories.context'
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
    const { refresh, promise } = use(SearchLaboratoriesContext)
    const { laboratories } = use(promise)
    const router = useRouter()

    const entity = useMemo(() => {
        return laboratories?.find(l => l.id === entityId)
    }, [laboratories, entityId])

    const onUnarchive = useCallback(async () => {
        if (!entityId) return
        startTransition(async () => {
            const response = await unarchiveLaboratory(entityId)
            setOpen(null)
            if (response.status === 'success') {
                return refresh()
            }
            if (response.type === 'not-found') {
                refresh()
            } else if (response.type === 'unexpected') {
                toastGenericError()
            } else if (response.type === 'permission') {
                toastPermissionError(response.missings)
            } else if (response.type === 'unauthorized') {
                router.replace('/login')
            }
        })
    }, [entityId, setOpen, refresh, router])

    const info = useMemo(
        () =>
            !entity ?
                ({} as Record<string, string | number>)
            :   {
                    Nombre: entity.name,
                    'Tipo de Laboratorio':
                        entity.type === LABORATORY_TYPE.LABORATORY ?
                            'Laboratorio'
                        :   'Centro de Computo',
                    'Horario de Apertura': entity.open_hour,
                    'Horario de Cierre': entity.close_hour,
                },
        [entity],
    )

    if (!entity) return null

    return (
        <AlertDialog
            open={open === 'UNARCHIVE_OR_DELETE'}
            onOpenChange={state =>
                setOpen(state ? 'UNARCHIVE_OR_DELETE' : null)
            }
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Laboratorio archivado</AlertDialogTitle>
                    <AlertDialogDescription>
                        El laboratorio {entity.name} está archivado. ¿Qué desea
                        hacer con <strong>{entity.name}</strong>?
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
