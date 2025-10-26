'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Ban, Trash2, UserIcon } from 'lucide-react'
import { Activity, useCallback, useState, useTransition } from 'react'
import { deleteMachine } from '@/actions/machines.actions'
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
import { useRouter } from 'next/navigation'
import { useMachines } from '@/hooks/machines.hooks'
import app from '@eliyya/type-routes'
import { CompletInput } from '@/components/Inputs'

export function DeleteDialog() {
    const [openedDialog, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedMachineAtom)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const { setMachines, refetchMachines } = useMachines()

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const res = await deleteMachine(entity.id)
            if (res.status === 'success') {
                setMachines(prev =>
                    prev.filter(machine => machine.id !== entity.id),
                )
                openDialog(null)
                return
            }
            if (res.type === 'not-found') {
                refetchMachines()
                openDialog(null)
            } else if (res.type === 'permission') {
                setMessage('No tienes permiso para eliminar esta máquina')
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
            open={openedDialog === 'DELETE'}
            onOpenChange={state => openDialog(state ? 'DELETE' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Dar de baja</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de dar de baja la máquina{' '}
                        <strong>{entity.number}</strong> con serie{' '}
                        <strong>{entity.serie}</strong>?
                        <strong>Esta acción es irreversible</strong>
                        Tal vez busca colocarla en mantenimiento
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
                            <Trash2 className='mr-2 h-5 w-5' />
                            Eliminar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
