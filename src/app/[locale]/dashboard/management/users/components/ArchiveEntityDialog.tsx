'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Archive, AtSignIcon, Ban, UserIcon } from 'lucide-react'
import { Activity, useCallback, useMemo, useState, useTransition } from 'react'
import { archiveUser } from '@/actions/users.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { entityToEditAtom, dialogOpenedAtom } from '@/global/users.globals'
import { useRoles } from '@/hooks/roles.hooks'
import { DEFAULT_ROLES } from '@/constants/client'
import { useUsers } from '@/hooks/users.hooks'
import { STATUS } from '@/prisma/generated/browser'
import { useRouter } from 'next/router'
import app from '@eliyya/type-routes'
import { CompletInput } from '@/components/Inputs'

export function ArchiveEntityDialog() {
    const [open, setOpen] = useAtom(dialogOpenedAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const { roles } = useRoles()
    const adminRole = roles.find(r => r.name === DEFAULT_ROLES.ADMIN)
    const { setUsers, refetchUsers } = useUsers()
    const router = useRouter()

    const role = useMemo(() => {
        if (!entity) return ''
        const role = roles.find(r => r.id === entity.role_id)
        if (!role) return 'Deleted Role'
        return role.name
    }, [entity.role_id])

    const onAction = useCallback(async () => {
        startTransition(async () => {
            const response = await archiveUser(entity.id)
            if (response.status === 'success') {
                setUsers(users =>
                    users.map(u =>
                        u.id !== entity.id ?
                            u
                        :   { ...u, status: STATUS.ARCHIVED },
                    ),
                )
                setOpen(null)
                return
            }
            if (response.type === 'not-allowed') {
                setOpen('preventArchiveAdmin')
            } else if (response.type === 'not-found') {
                refetchUsers()
                setOpen(null)
            } else if (response.type === 'permission') {
                setMessage('No tienes permiso para archivar a este usuario')
            } else if (response.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (response.type === 'unexpected') {
                setMessage('Algo salio mal, intente mas tarde')
            }
        })
    }, [entity.id])

    if (!entity || !adminRole) return null

    return (
        <Dialog
            open={open === 'archive'}
            onOpenChange={op => setOpen(op ? 'archive' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Archivar Usuario</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de archivar al usuario{' '}
                        <strong>{entity.name}</strong>?
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
