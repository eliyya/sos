'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArchiveRestore, AtSignIcon, Ban, UserIcon } from 'lucide-react'
import {
    Activity,
    use,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
import { unarchiveUser } from '@/actions/users.actions'
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
import { CompletInput } from '@/components/Inputs'
import { SearchUsersContext } from '@/contexts/users.context'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

export function UnarchiveEntityDialog() {
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
            const response = await unarchiveUser(entityId)
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
            open={open === 'UNARCHIVE'}
            onOpenChange={op => setOpen(op ? 'UNARCHIVE' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Desarchivar Usuario</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de desarchivar al usuario {entity.name}?
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
                            variant={'secondary'}
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
                            variant={'default'}
                            disabled={inTransition}
                        >
                            <ArchiveRestore className='mr-2 h-5 w-5' />
                            Desarchivar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
