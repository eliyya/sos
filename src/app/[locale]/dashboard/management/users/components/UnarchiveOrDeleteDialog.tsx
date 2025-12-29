'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
    ArchiveRestoreIcon,
    AtSignIcon,
    BanIcon,
    TrashIcon,
    UserIcon,
} from 'lucide-react'
import {
    Activity,
    use,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
import { unarchiveUserAction } from '@/actions/users.actions'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { selectedIdAtom, dialogAtom } from '@/global/management.globals'
import { CompletInput } from '@/components/Inputs'
import { SearchUsersContext } from '@/contexts/users.context'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

export function UnarchiveOrDeleteDialog() {
    const [open, setOpen] = useAtom(dialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entityId = useAtomValue(selectedIdAtom)
    const [message, setMessage] = useState('')
    const { refresh, promise } = use(SearchUsersContext)
    const router = useRouter()
    const { users } = use(promise)

    const entity = useMemo(() => {
        if (!entityId) return null
        return users.find(user => user.id === entityId)
    }, [entityId, users])

    const onAction = useCallback(() => {
        if (!entityId) return
        startTransition(async () => {
            const response = await unarchiveUserAction(entityId)
            if (response.status === 'success') {
                refresh()
                setOpen(null)
                return
            }
            if (response.type === 'not-found') {
                setMessage(response.message)
            } else if (response.type === 'permission') {
                setMessage('No tienes permiso para desarchivar este usuario')
            } else if (response.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (response.type === 'unexpected') {
                setMessage('Algo sucedio mal, intente nuevamente')
            }
            setTimeout(setMessage, 5_000, '')
        })
    }, [entityId, startTransition, setOpen, refresh, router])

    if (!entity) return null

    return (
        <Dialog
            open={open === 'UNARCHIVE_OR_DELETE'}
            onOpenChange={op => setOpen(op ? 'UNARCHIVE_OR_DELETE' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Usuario archivado</DialogTitle>
                    <DialogDescription>
                        El usuario {entity.name} está archivado. ¿Qué desea
                        hacer con él? <strong>{entity.name}</strong>?
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
                        label='Name'
                        disabled
                        icon={UserIcon}
                        value={entity.name}
                    />
                    <CompletInput
                        label='Username'
                        disabled
                        icon={AtSignIcon}
                        value={entity.username}
                    />
                    <CompletInput
                        label='Role'
                        disabled
                        icon={UserIcon}
                        value={entity.role.name}
                    />
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            type='button'
                            variant='secondary'
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
                                setOpen('DELETE')
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
