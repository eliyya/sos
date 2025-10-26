'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
    ArchiveRestoreIcon,
    AtSignIcon,
    BanIcon,
    TrashIcon,
    UserIcon,
} from 'lucide-react'
import { Activity, useMemo, useState, useTransition } from 'react'
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
import { entityToEditAtom, dialogOpenedAtom } from '@/global/users.globals'
import { useUsers } from '@/hooks/users.hooks'
import { STATUS } from '@/prisma/generated/enums'
import { useRoles } from '@/hooks/roles.hooks'
import { CompletInput } from '@/components/Inputs'

export function UnarchiveOrDeleteDialog() {
    const [open, setOpen] = useAtom(dialogOpenedAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const { setUsers } = useUsers()
    const { roles } = useRoles()

    const role = useMemo(() => {
        if (!entity) return ''
        const role = roles.find(r => r.id === entity.role_id)
        if (!role) return 'Deleted Role'
        return role.name
    }, [entity.role_id])

    if (!entity) return null

    return (
        <Dialog
            open={open === 'unarchiveOrDelete'}
            onOpenChange={op => setOpen(op ? 'unarchiveOrDelete' : null)}
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
                    action={data => {
                        startTransition(async () => {
                            const id = data.get('id') as string
                            const response = await unarchiveUser(id)
                            if (response.status === 'error') {
                                if (response.type === 'not-found') {
                                    setMessage(response.message)
                                } else {
                                    setMessage(
                                        'Algo sucedio mal, intente nuevamente',
                                    )
                                }
                                setTimeout(() => setMessage(''), 5_000)
                            } else {
                                setUsers(users =>
                                    users.map(user =>
                                        user.id === id ?
                                            { ...user, status: STATUS.ACTIVE }
                                        :   user,
                                    ),
                                )
                                setOpen(null)
                            }
                        })
                    }}
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
                                setOpen('delete')
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
