'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArchiveRestoreIcon, BanIcon, TrashIcon, UserIcon } from 'lucide-react'
import {
    Activity,
    Suspense,
    use,
    useCallback,
    useState,
    useTransition,
} from 'react'
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
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { CompletInput } from '@/components/Inputs'
import { SearchMachinesContext } from '@/contexts/machines.context'

function UnarchiveOrDeleteDialog() {
    const [open, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedMachineAtom)
    const [message, setMessage] = useState('')
    const { refreshMachines } = use(SearchMachinesContext)
    const router = useRouter()

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const res = await availableMachine(entity.id)
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
            open={open === 'UNARCHIVE_OR_DELETE'}
            onOpenChange={state =>
                openDialog(state ? 'UNARCHIVE_OR_DELETE' : null)
            }
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Máquina en mantenimiento</DialogTitle>
                    <DialogDescription>
                        La máquina #{entity.number} con serie {entity.serie}{' '}
                        está en mantenimiento. ¿Qué desea hacer?
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
                            type='button'
                            variant='secondary'
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                openDialog(null)
                            }}
                        >
                            <BanIcon className='mr-2 h-5 w-5' />
                            Cancelar
                        </Button>
                        <Button
                            type='submit'
                            variant='default'
                            disabled={inTransition}
                        >
                            <ArchiveRestoreIcon className='mr-2 h-5 w-5' />
                            Desarchivar
                        </Button>
                        <Button
                            type='button'
                            variant='destructive'
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                openDialog('DELETE')
                            }}
                        >
                            <TrashIcon className='mr-2 h-5 w-5' />
                            Eliminar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function SuspenseUnarchiveOrDeleteDialog() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <UnarchiveOrDeleteDialog />
        </Suspense>
    )
}

export { SuspenseUnarchiveOrDeleteDialog as UnarchiveOrDeleteDialog }
