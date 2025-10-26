'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Ban, MonitorCogIcon } from 'lucide-react'
import { Activity, useCallback, useState, useTransition } from 'react'
import { maintainanceMachine } from '@/actions/machines.actions'
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

export function ArchiveDialog() {
    const [dialogOpened, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedMachineAtom)
    const [message, setMessage] = useState('')
    const { setMachines, refetchMachines } = useMachines()
    const router = useRouter()

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const res = await maintainanceMachine(entity.id)
            if (res.status === 'success') {
                openDialog(null)
                setMachines(prev =>
                    prev.map(machine =>
                        machine.id === entity.id ?
                            { ...machine, status: MACHINE_STATUS.MAINTENANCE }
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
            open={dialogOpened === 'ARCHIVE'}
            onOpenChange={state => openDialog(state ? 'ARCHIVE' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Poner en mantenimiento</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de poner la máquina #{entity.number} con
                        serie {entity.serie} en mantenimiento?
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <input type='hidden' value={entity.id} name='id' />
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
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
                            variant={'destructive'}
                            disabled={inTransition}
                        >
                            <MonitorCogIcon className='mr-2 h-5 w-5' />
                            Poner en mantenimiento
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
