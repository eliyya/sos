'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
    ArchiveRestoreIcon,
    BanIcon,
    Clock8Icon,
    MicroscopeIcon,
    SquarePenIcon,
} from 'lucide-react'
import {
    Activity,
    use,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { unarchiveLaboratory } from '@/actions/laboratories.actions'
import { useRouter } from 'next/navigation'
import { CompletInput } from '@/components/Inputs'
import { LABORATORY_TYPE } from '@/prisma/generated/enums'
import { SearchLaboratoriesContext } from '@/contexts/laboratories.context'

export function UnarchiveDialog() {
    const [open, setOpen] = useAtom(dialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entityId = useAtomValue(selectedIdAtom)
    const [message, setMessage] = useState('')
    const { refreshLaboratories, laboratoriesPromise } = use(
        SearchLaboratoriesContext,
    )
    const { laboratories } = use(laboratoriesPromise)
    const router = useRouter()

    const entity = useMemo(() => {
        return laboratories.find(l => l.id === entityId)
    }, [laboratories, entityId])

    const onAction = useCallback(async () => {
        if (!entityId) return
        startTransition(async () => {
            const response = await unarchiveLaboratory(entityId)
            if (response.status === 'success') {
                refreshLaboratories()
                setOpen(null)
            } else {
                if (response.type === 'not-found') {
                    refreshLaboratories()
                    setOpen(null)
                } else if (response.type === 'unexpected') {
                    setMessage('Ha ocurrido un error, intente más tarde')
                } else if (response.type === 'permission') {
                    setMessage(
                        'No tienes permiso para archivar este laboratorio',
                    )
                } else if (response.type === 'unauthorized') {
                    router.replace('/login')
                }
            }
        })
    }, [entityId, refreshLaboratories, setOpen, router])

    if (!entity) return null

    return (
        <Dialog
            open={open === 'UNARCHIVE'}
            onOpenChange={state => {
                if (!state) setOpen(null)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Desarchivar Laboratorio</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de desarchivar {entity.name}?
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <CompletInput
                        label='Nombre'
                        disabled
                        value={entity.name}
                        icon={SquarePenIcon}
                    />
                    <CompletInput
                        label='Tipo de Laboratorio'
                        disabled
                        value={
                            entity.type === LABORATORY_TYPE.LABORATORY ?
                                'Laboratorio'
                            :   'Centro de Computo'
                        }
                        icon={MicroscopeIcon}
                    />
                    <CompletInput
                        label='Horario de Apertura'
                        disabled
                        value={entity.open_hour}
                        icon={Clock8Icon}
                    />
                    <CompletInput
                        label='Horario de Cierre'
                        disabled
                        value={entity.close_hour}
                        icon={Clock8Icon}
                    />
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            variant={'secondary'}
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                setOpen(null)
                            }}
                        >
                            <BanIcon className='mr-2 h-5 w-5' />
                            Cancelar
                        </Button>
                        <Button
                            type='submit'
                            variant={'default'}
                            disabled={inTransition}
                        >
                            <ArchiveRestoreIcon className='mr-2 h-5 w-5' />
                            Desarchivar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
