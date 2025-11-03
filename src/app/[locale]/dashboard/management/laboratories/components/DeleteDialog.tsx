'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
    BanIcon,
    Clock8Icon,
    MicroscopeIcon,
    SquarePenIcon,
    Trash2Icon,
} from 'lucide-react'
import { Activity, use, useCallback, useState, useTransition } from 'react'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import {
    openDialogAtom,
    selectedLaboratoryAtom,
} from '@/global/laboratories.globals'
import { deleteLaboratory } from '@/actions/laboratories.actions'
import { useRouter } from 'next/navigation'
import { CompletInput } from '@/components/Inputs'
import { LABORATORY_TYPE } from '@/prisma/generated/enums'
import { SearchLaboratoriesContext } from '@/contexts/laboratories.context'

export function DeleteDialog() {
    const [open, setOpen] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedLaboratoryAtom)
    const [message, setMessage] = useState('')
    const { refreshLaboratories } = use(SearchLaboratoriesContext)
    const router = useRouter()

    const onAction = useCallback(async () => {
        if (!entity) return
        startTransition(async () => {
            const response = await deleteLaboratory(entity.id)
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
    }, [entity, setOpen, refreshLaboratories, router])

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
