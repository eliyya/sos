'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
    AtSignIcon,
    KeyIcon,
    SaveIcon,
    TriangleIcon,
    UserIcon,
} from 'lucide-react'
import { Activity, useEffect, useMemo, useState, useTransition } from 'react'
import { editUser } from '@/actions/users.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { CompletInput, RetornableCompletInput } from '@/components/Inputs'
import { RetornableCompletSelect } from '@/components/Select'
import {
    entityToEditAtom,
    editPasswordAtom,
    editPasswordErrorAtom,
    editConfirmPasswordAtom,
    editConfirmPasswordErrorAtom,
    passwordFocusAtom,
    dialogOpenedAtom,
} from '@/global/users.globals'
import { useRoles } from '@/hooks/roles.hooks'
import { useUsers } from '@/hooks/users.hooks'

export function EditUserDialog() {
    const [open, setOpen] = useAtom(dialogOpenedAtom)
    const [inTransition, startTransition] = useTransition()
    const oldUser = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const { setUsers } = useUsers()

    if (!oldUser) return null

    return (
        <Dialog
            open={open === 'edit'}
            onOpenChange={op => setOpen(op ? 'edit' : null)}
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
                            const user_id = data.get('user_id') as string
                            const name = data.get('name') as string
                            const username = data.get('username') as string
                            const role_id = data.get('role_id') as string
                            const password = data.get('password') as string
                            const response = await editUser({
                                id: user_id,
                                name,
                                username,
                                role_id,
                                password,
                            })
                            if (response.status === 'error') {
                                if (response.type === 'not-found') {
                                    setMessage(response.message)
                                    setTimeout(() => {
                                        setMessage('')
                                    }, 5_000)
                                    return
                                }
                                setMessage(
                                    'Algo sucedio mal, intente nuevamente',
                                )
                                setTimeout(() => {
                                    setMessage('')
                                }, 5_000)
                                return
                            }
                            setUsers(users =>
                                users.map(user =>
                                    user.id === user_id ?
                                        { ...user, name, username, role_id }
                                    :   user,
                                ),
                            )
                            setOpen(null)
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>

                    <input type='hidden' value={oldUser.id} name='user_id' />
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
    const oldUser = useAtomValue(entityToEditAtom)

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
    const oldUser = useAtomValue(entityToEditAtom)
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
    const oldUser = useAtomValue(entityToEditAtom)

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
