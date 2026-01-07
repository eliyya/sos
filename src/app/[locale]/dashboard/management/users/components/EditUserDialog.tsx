'use client'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    AtSignIcon,
    KeyIcon,
    SaveIcon,
    TriangleIcon,
    UserIcon,
} from 'lucide-react'
import {
    Activity,
    use,
    useEffect,
    useMemo,
    useState,
    useTransition,
} from 'react'
import { editUserAction } from '@/actions/users.actions'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { MessageError } from '@/components/Error'
import { CompletInput, RetornableCompletInput } from '@/components/Inputs'
import { RetornableCompletSelect } from '@/components/Select'
import { selectedIdAtom, dialogAtom } from '@/global/management.globals'
import { useRoles } from '@/hooks/roles.hooks'
import { SearchUsersContext } from '@/contexts/users.context'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

const editPasswordAtom = atom('')
const editPasswordErrorAtom = atom('')
const editConfirmPasswordAtom = atom('')
const editConfirmPasswordErrorAtom = atom('')
const passwordFocusAtom = atom(false)

export function EditUserDialog() {
    const [open, setOpen] = useAtom(dialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entityId = useAtomValue(selectedIdAtom)
    const [message, setMessage] = useState('')
    const { refresh, promise } = use(SearchUsersContext)
    const setPasswordError = useSetAtom(editPasswordErrorAtom)
    const { users } = use(promise)
    const router = useRouter()

    const oldUser = useMemo(() => {
        if (!entityId) return null
        return users.find(user => user.id === entityId)
    }, [entityId, users])

    if (!oldUser) return null

    return (
        <Dialog
            open={open === 'EDIT'}
            onOpenChange={op => setOpen(op ? 'EDIT' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit @{oldUser.username}</DialogTitle>
                    <DialogDescription>
                        Edit the user&apos;s information
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const name = data.get('name') as string
                            const username = data.get('username') as string
                            const role_id = data.get('role_id') as string
                            const password = data.get('password') as string
                            const response = await editUserAction({
                                id: oldUser.id,
                                name,
                                username,
                                role_id,
                                password,
                            })
                            if (response.status === 'success') {
                                setOpen(null)
                                refresh()
                            } else if (response.type === 'not-found') {
                                setMessage(response.message)
                                setTimeout(setMessage, 5_000, '')
                            } else if (response.type === 'invalid-input') {
                                if (response.field === 'password') {
                                    setPasswordError(response.message)
                                }
                            } else if (response.type === 'unexpected') {
                                setMessage(
                                    'Algo sucedio mal, intente nuevamente',
                                )
                                setTimeout(setMessage, 5_000, '')
                                return
                            } else if (response.type === 'permission') {
                                setMessage('No tienes suficientes permisos')
                                setTimeout(setMessage, 5_000, '')
                                return
                            } else if (response.type === 'unauthorized') {
                                router.replace(app.$locale.auth.login('es'))
                                return
                            }
                            setMessage('Algo sucedio mal, intente nuevamente')
                            setTimeout(setMessage, 5_000, '')
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>

                    <EditNameInput />
                    <EditUsernameInput />
                    <EditRoleSelect />
                    <EditPasswordInput />
                    <ConfirmEditPasswordInput />

                    <Button type='submit' disabled={inTransition}>
                        <SaveIcon className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function EditUsernameInput() {
    const entityId = useAtomValue(selectedIdAtom)
    const { promise } = use(SearchUsersContext)
    const { users } = use(promise)

    const oldUser = useMemo(() => {
        if (!entityId) return null
        return users.find(user => user.id === entityId)
    }, [entityId, users])

    if (!oldUser) return null

    return (
        <RetornableCompletInput
            originalValue={oldUser.username}
            required
            label='Username'
            type='text'
            name='username'
            icon={AtSignIcon}
        />
    )
}

export function EditRoleSelect() {
    const entityId = useAtomValue(selectedIdAtom)
    const { promise } = use(SearchUsersContext)
    const { users } = use(promise)

    const oldUser = useMemo(() => {
        if (!entityId) return null
        return users.find(user => user.id === entityId)
    }, [entityId, users])

    const { roles } = useRoles()
    const rolesOptions = useMemo(() => {
        return roles.map(role => ({
            value: role.id,
            label: role.name,
        }))
    }, [roles])
    const originalRole = useMemo(() => {
        if (!oldUser) return null
        const role = roles.find(role => role.id === oldUser.role_id)
        if (!role) return null
        return { value: role.id, label: role.name }
    }, [oldUser, roles])

    if (!oldUser) return null

    return (
        <RetornableCompletSelect
            label='Rol'
            name='role_id'
            originalValue={originalRole}
            options={rolesOptions}
            icon={TriangleIcon}
        />
    )
}

export function EditPasswordInput() {
    const [password, setPassword] = useAtom(editPasswordAtom)
    const [error, setError] = useAtom(editPasswordErrorAtom)

    return (
        <RetornableCompletInput
            originalValue=''
            label='Nueva contraseña'
            type='password'
            name='password'
            icon={KeyIcon}
            value={password}
            onChange={e => {
                const password = e.target.value
                setPassword(password)
                setError('')
                if (!password) return
                if (!/[A-Z]/.test(password))
                    setError(
                        'La contraseña debe contener al menos una mayúscula',
                    )
                if (!/[0-9]/.test(password))
                    setError('La contraseña debe contener al menos un número')
                if (!/[!@#$%^&*]/.test(password))
                    setError(
                        'La contraseña debe contener al menos un carácter especial como !@#$%^&*',
                    )
                if (password.length < 10)
                    setError('La contraseña debe tener al menos 10 caracteres')
            }}
            error={error}
        />
    )
}

export function EditNameInput() {
    const entityId = useAtomValue(selectedIdAtom)
    const { promise } = use(SearchUsersContext)
    const { users } = use(promise)

    const oldUser = useMemo(() => {
        if (!entityId) return null
        return users.find(user => user.id === entityId)
    }, [entityId, users])

    if (!oldUser) return null

    return (
        <RetornableCompletInput
            originalValue={oldUser.name}
            required
            label='Name'
            type='text'
            name='name'
            icon={UserIcon}
        />
    )
}

export function ConfirmEditPasswordInput() {
    const [confirmPassword, setConfirmPassword] = useAtom(
        editConfirmPasswordAtom,
    )
    const [error, setError] = useAtom(editConfirmPasswordErrorAtom)
    const focus = useAtomValue(passwordFocusAtom)
    const password = useAtomValue(editPasswordAtom)

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (focus) return
            if (confirmPassword !== password)
                setError('Las contraseñas no coinciden')
        }, 500)

        return () => clearTimeout(handler)
    }, [confirmPassword, password, setError, focus])
    return (
        <CompletInput
            label='Confirmar contraseña'
            type='password'
            name='confirm-password'
            icon={KeyIcon}
            value={confirmPassword}
            error={error}
            onChange={e => {
                setConfirmPassword(e.target.value)
                setError('')
            }}
        />
    )
}
