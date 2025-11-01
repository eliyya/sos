'use client'

import { useAtom, useAtomValue } from 'jotai'
import { AtSignIcon, Ban, Trash2, UserIcon } from 'lucide-react'
import {
    Activity,
    use,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
import { deleteUser } from '@/actions/users.actions'
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
import { useRoles } from '@/hooks/roles.hooks'
import { DEFAULT_ROLES } from '@/constants/client'
import { CompletInput } from '@/components/Inputs'
import { SearchUsersContext } from '@/contexts/users.context'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

export function DeleteEntityDialog() {
    const [open, setOpen] = useAtom(dialogOpenedAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const { roles } = useRoles()
    const adminRole = roles.find(r => r.name === DEFAULT_ROLES.ADMIN)
    const { refreshUsers } = use(SearchUsersContext)
    const router = useRouter()

    const role = useMemo(() => {
        if (!entity) return ''
        const role = roles.find(r => r.id === entity.role_id)
        if (!role) return 'Deleted Role'
        return role.name
    }, [entity, roles])

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const response = await deleteUser(entity.id)
            if (response.status === 'success') {
                refreshUsers()
                setOpen(null)
                return
            }
            if (response.type === 'not-allowed') {
                if (response.message === 'Unique admin cannot be deleted') {
                    setOpen('preventArchiveAdmin')
                } else {
                    setMessage('Operacion no permitida')
                    setTimeout(() => setMessage(''), 5_000)
                }
            } else if (response.type === 'not-found') {
                setMessage('El usuario no se encontro')
                setTimeout(() => setMessage(''), 5_000)
            } else if (response.type === 'permission') {
                setMessage('No tienes permiso para eliminar este usuario')
                setTimeout(() => setMessage(''), 5_000)
            } else if (response.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
                setTimeout(() => setMessage(''), 5_000)
            } else if (response.type === 'unexpected') {
                setMessage('Algo sucedio mal, intente nuevamente')
                setTimeout(() => setMessage(''), 5_000)
            }
        })
    }, [entity, startTransition, setOpen, refreshUsers, router])

    if (!entity || !adminRole) return null

    return (
        <Dialog
            open={open === 'delete'}
            onOpenChange={open => {
                setOpen(open ? 'delete' : null)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar Usuario</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de eliminar el usuario{' '}
                        <strong>{entity.name}</strong>?
                        <strong>Esta acción es irreversible</strong>
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
                            <Trash2 className='mr-2 h-5 w-5' />
                            Eliminar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
