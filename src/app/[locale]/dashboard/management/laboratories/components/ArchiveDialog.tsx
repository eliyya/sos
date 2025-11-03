'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
    Archive,
    Ban,
    Clock8Icon,
    MicroscopeIcon,
    SquarePenIcon,
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
import { archiveLaboratory } from '@/actions/laboratories.actions'
import { useRouter } from 'next/navigation'
import { CompletInput } from '@/components/Inputs'
import { LABORATORY_TYPE } from '@/prisma/generated/enums'
import { SearchLaboratoriesContext } from '@/contexts/laboratories.context'

export function ArchiveDialog() {
    const [open, setOpen] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedLaboratoryAtom)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const { refreshLaboratories } = use(SearchLaboratoriesContext)

    const onAction = useCallback(async () => {
        if (!entity) return
        startTransition(async () => {
            const response = await archiveLaboratory(entity.id)
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
    }, [entity, refreshLaboratories, setOpen, router])

    if (!entity) return null

    return (
        <Dialog
            open={open === 'ARCHIVE'}
            onOpenChange={state => {
                if (!state) setOpen(null)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Archivar Laboratorio</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de archivar {entity.name}?
                        <strong>Esta acción es reversible</strong>
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
                            <Ban className='mr-2 h-5 w-5' />
                            Cancelar
                        </Button>
                        <Button
                            type='submit'
                            variant={'destructive'}
                            disabled={inTransition}
                        >
                            <Archive className='mr-2 h-5 w-5' />
                            Archivar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
