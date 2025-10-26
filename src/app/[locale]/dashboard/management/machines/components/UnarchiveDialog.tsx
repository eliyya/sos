'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Ban, MonitorCheckIcon, UserIcon } from 'lucide-react'
import { Activity, useCallback, useState, useTransition } from 'react'
import { availableMachine } from '@/actions/machines.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { openDialogAtom, selectedMachineAtom } from '@/global/machines.globals'
import { useMachines } from '@/hooks/machines.hooks'
import { MACHINE_STATUS } from '@/prisma/generated/enums'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { CompletInput } from '@/components/Inputs'

export function UnarchiveDialog() {
    const [open, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedMachineAtom)
    const [message, setMessage] = useState('')
    const { setMachines, refetchMachines } = useMachines()
    const router = useRouter()

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const res = await availableMachine(entity.id)
            if (res.status === 'success') {
                openDialog(null)
                setMachines(prev =>
                    prev.map(machine =>
                        machine.id === entity.id ?
                            { ...machine, status: MACHINE_STATUS.AVAILABLE }
                        :   machine,
                    ),
                )
                return
            }
            if (res.type === 'not-found') {
                refetchMachines()
                openDialog(null)
            } else if (res.type === 'permission') {
                setMessage(res.message)
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                setMessage('Ha ocurrido un error inesperado, intente mas tarde')
            }
        })
    }, [entity, openDialog, router, setMachines, refetchMachines])

    if (!entity) return null

    return (
        <Dialog
            open={open === 'UNARCHIVE'}
            onOpenChange={state => openDialog(state ? 'UNARCHIVE' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reactivar Máquina</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de reactivar la máquina {entity.number}?
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
                        disabled
                        value={entity.number}
                        label='Numero'
                        icon={UserIcon}
                    />
                    <CompletInput
                        disabled
                        value={entity.processor}
                        label='Procesador'
                        icon={UserIcon}
                    />
                    <CompletInput
                        disabled
                        value={entity.ram}
                        label='RAM'
                        icon={UserIcon}
                    />
                    <CompletInput
                        disabled
                        label='Almacenamiento'
                        value={entity.storage}
                        icon={UserIcon}
                    />
                    <CompletInput
                        disabled
                        label='Serie'
                        value={entity?.serie ?? ''}
                        icon={UserIcon}
                    />
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            variant={'secondary'}
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                openDialog(null)
                            }}
                        >
                            <Ban className='mr-2 h-5 w-5' />
                            Cancelar
                        </Button>
                        <Button
                            type='submit'
                            variant={'default'}
                            disabled={inTransition}
                        >
                            <MonitorCheckIcon className='mr-2 h-5 w-5' />
                            Reactivar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
