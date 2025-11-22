'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
    BanIcon,
    Clock8Icon,
    MicroscopeIcon,
    SquarePenIcon,
    Trash2Icon,
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
import { deleteLaboratory } from '@/actions/laboratories.actions'
import { useRouter } from 'next/navigation'
import { CompletInput } from '@/components/Inputs'
import { LABORATORY_TYPE } from '@/prisma/generated/enums'
import { SearchLaboratoriesContext } from '@/contexts/laboratories.context'

export function DeleteDialog() {
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
        return laboratories?.find(l => l.id === entityId)
    }, [laboratories, entityId])

    const onAction = useCallback(async () => {
        if (!entityId) return
        startTransition(async () => {
            const response = await deleteLaboratory(entityId)
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
                        'No tienes permiso para eliminar este laboratorio',
                    )
                } else if (response.type === 'unauthorized') {
                    router.replace('/login')
                }
            }
        })
    }, [entityId, setOpen, refreshLaboratories, router])

    if (!entity) return null

    return (
        <Dialog
            open={open === 'DELETE'}
            onOpenChange={state => {
                if (!state) setOpen(null)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar Laboratorio</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de eliminar <strong>{entity.name}</strong>?
                        <strong>Esta acción es irreversible</strong>
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
                            variant={'destructive'}
                            disabled={inTransition}
                        >
                            <Trash2Icon className='mr-2 h-5 w-5' />
                            Eliminar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
