'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Ban, MonitorCogIcon, UserIcon } from 'lucide-react'
import {
    Activity,
    Suspense,
    use,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
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
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { CompletInput } from '@/components/Inputs'
import { SearchMachinesContext } from '@/contexts/machines.context'

function ArchiveDialog() {
    const [dialogOpened, openDialog] = useAtom(dialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entityId = useAtomValue(selectedIdAtom)
    const [message, setMessage] = useState('')
    const { refreshMachines, machinesPromise } = use(SearchMachinesContext)
    const router = useRouter()

    const { machines } = use(machinesPromise)

    const entity = useMemo(() => {
        return machines.find(m => m.id === entityId)
    }, [machines, entityId])

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const res = await maintainanceMachine(entity.id)
            if (res.status === 'success') {
                openDialog(null)
                refreshMachines()
                return
            }
            if (res.type === 'not-found') {
                refreshMachines()
                openDialog(null)
            } else if (res.type === 'permission') {
                setMessage(res.message)
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                setMessage('Ha ocurrido un error inesperado, intente mas tarde')
            }
        })
    }, [entity, openDialog, router, refreshMachines])

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
                            <MonitorCogIcon className='mr-2 h-5 w-5' />
                            Poner en mantenimiento
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function SuspenseArchiveDialog() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ArchiveDialog />
        </Suspense>
    )
}

export { SuspenseArchiveDialog as ArchiveDialog }
