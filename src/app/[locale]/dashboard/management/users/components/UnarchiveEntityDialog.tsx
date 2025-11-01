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
import { dialogOpenedAtom, entityToEditAtom } from '@/global/users.globals'
import { CompletInput } from '@/components/Inputs'
import { useRoles } from '@/hooks/roles.hooks'
import { SearchUsersContext } from '@/contexts/users.context'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

export function UnarchiveEntityDialog() {
    const [open, setOpen] = useAtom(dialogOpenedAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const { roles } = useRoles()
    const { refreshUsers } = use(SearchUsersContext)
    const router = useRouter()

    const role = useMemo(() => {
        if (!entity) return ''
        const role = roles.find(r => r.id === entity.role_id)
        if (!role) return 'Deleted Role'
        return role.name
    }, [entity, roles])

    const onAction = useCallback(() => {
        startTransition(async () => {
            const response = await unarchiveUser(entity.id)
            if (response.status === 'success') {
                refreshUsers()
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
    }, [entity, startTransition, setOpen, refreshUsers, router])

    if (!entity) return null

    return (
        <Dialog
            open={open === 'unarchive'}
            onOpenChange={op => setOpen(op ? 'unarchive' : null)}
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
                        value={role}
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
