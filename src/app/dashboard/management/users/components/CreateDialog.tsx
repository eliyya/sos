'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    AtSignIcon,
    KeyIcon,
    SaveIcon,
    TriangleIcon,
    UserIcon,
} from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { usernameIsTaken } from '@/actions/users.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { CompletInput } from '@/components/Inputs'
import { CompletSelect } from '@/components/Select'
import {
    canSuggestUsernameAtom,
    confirmPasswordAtom,
    confirmPasswordErrorAtom,
    entityToEditAtom,
    nameAtom,
    nameErrorAtom,
    openCreateUserAtom,
    openUnarchiveOrDeleteAtom,
    passwordAtom,
    passwordErrorAtom,
    passwordFocusAtom,
    updateAtom,
    usernameAtom,
    usernameErrorAtom,
} from '@/global/management-users'
import { authClient } from '@/lib/auth-client'
import { capitalize, truncateByUnderscore } from '@/lib/utils'
import { rolesAtom } from '@/global/roles.globals'

export function CreateUserDialog() {
    const [open, setOpen] = useAtom(openCreateUserAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateAtom)
    const setUsernameError = useSetAtom(usernameErrorAtom)
    const setOpenUnarchiveOrDelete = useSetAtom(openUnarchiveOrDeleteAtom)
    const setTakenUser = useSetAtom(entityToEditAtom)
    const setName = useSetAtom(nameAtom)
    const setUsername = useSetAtom(usernameAtom)
    const setPassword = useSetAtom(passwordAtom)
    const setConfirmPassword = useSetAtom(confirmPasswordAtom)

    return (
        <Dialog
            open={open}
            onOpenChange={open => {
                setOpen(open)
                if (!open) {
                    setName('')
                    setUsername('')
                    setPassword('')
                    setConfirmPassword('')
                    setUsernameError('')
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Usuario</DialogTitle>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const name = capitalize(
                                (data.get('name') as string).trim(),
                            )
                            const username = (
                                data.get('username') as string
                            ).trim()
                            const password = data.get('password') as string
                            const role_id = data.get('role_id') as string
                            const response = await usernameIsTaken(username)
                            if (
                                response.status === 'success' &&
                                response.type === 'archived'
                            ) {
                                setOpen(false)
                                setTakenUser(response.user)
                                setOpenUnarchiveOrDelete(true)
                                // reset
                                setName('')
                                setUsername('')
                                setPassword('')
                                setConfirmPassword('')
                                return
                            }
                            const { error } = await authClient.signUp.email({
                                email: `${username}@noemail.local`,
                                password,
                                name,
                                username,
                                role_id,
                            })
                            if (error) {
                                if (
                                    error.code ===
                                    'USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER'
                                ) {
                                    setUsernameError(error.message!)
                                } else setMessage('Algo salio mal')
                                console.log(error)
                            } else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    500,
                                )
                                setOpen(false)
                            }
                            setTimeout(() => {
                                setMessage('')
                            }, 5_000)
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && <MessageError>{message}</MessageError>}
                    <NameInput />
                    <UsernameInput />
                    <RoleSelect />
                    <PasswordInput />
                    <ConfirmPasswordInput />
                    <Button type='submit' disabled={inTransition}>
                        <SaveIcon className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function RoleSelect() {
    const roles = useAtomValue(rolesAtom)

    return (
        <CompletSelect
            required
            label='Rol'
            name='role_id'
            options={roles.map(r => ({
                label: r.name,
                value: r.id,
            }))}
            icon={TriangleIcon}
        />
    )
}

export function NameInput() {
    const [name, setName] = useAtom(nameAtom)
    const [error, setError] = useAtom(nameErrorAtom)
    const setUsername = useSetAtom(usernameAtom)
    const canSuggestUsername = useAtomValue(canSuggestUsernameAtom)

    return (
        <CompletInput
            required
            label='Nombre'
            type='text'
            name='name'
            icon={UserIcon}
            value={name}
            error={error}
            onChange={e => {
                const name = e.target.value
                setName(name)
                setError('')
                if (!canSuggestUsername) return
                if (name.length < 3) return
                setUsername(
                    truncateByUnderscore(
                        name.toLowerCase().replace(/\s+/g, '_'),
                    ),
                )
            }}
        />
    )
}

export function UsernameInput() {
    const [username, setUsername] = useAtom(usernameAtom)
    const [error, setError] = useAtom(usernameErrorAtom)
    const setCanSuggestUsername = useSetAtom(canSuggestUsernameAtom)
    const [focus, setFocus] = useState(false)

    return (
        <CompletInput
            required
            label='Username'
            type='text'
            name='username'
            icon={AtSignIcon}
            min={3}
            max={30}
            pattern='^[a-z0-9_]+$'
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            value={username}
            error={error}
            onChange={e => {
                const username = e.target.value
                setUsername(username)
                setError('')
                if (!username) return setCanSuggestUsername(true)
                if (username && focus) setCanSuggestUsername(false)
                if (username.length < 3)
                    setError(
                        'El nombre de usuario debe tener al menos 3 caracteres',
                    )
                if (username.length > 30)
                    setError(
                        'El nombre de usuario puede tener hasta 30 caracteres',
                    )
                if (!/^[a-z0-9_]+$/.test(username))
                    setError(
                        'El nombre de usuario debe contener solo minusculas, numeros y guiones bajos',
                    )
                if (username.includes(' '))
                    setError('El nombre de usuario no debe contener espacios')
            }}
        />
    )
}

export function PasswordInput() {
    const [pass, setPassword] = useAtom(passwordAtom)
    const [error, setError] = useAtom(passwordErrorAtom)
    const setFocus = useSetAtom(passwordFocusAtom)

    return (
        <CompletInput
            required
            label='Contraseña'
            type='password'
            name='password'
            icon={KeyIcon}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            value={pass}
            error={error}
            onChange={e => {
                const password = e.target.value
                setPassword(e.target.value)
                setError('')
                if (!password) return
                if (!/[A-Z]/.test(password))
                    return setError(
                        'La contraseña debe contener al menos una mayúscula',
                    )
                if (!/[0-9]/.test(password))
                    return setError(
                        'La contraseña debe contener al menos un número',
                    )
                if (!/[!@#$%^&*]/.test(password))
                    return setError(
                        'La contraseña debe contener al menos un carácter especial como !@#$%^&*',
                    )
                if (password.length < 10)
                    return setError(
                        'La contraseña debe tener al menos 10 caracteres',
                    )
            }}
        />
    )
}

export function ConfirmPasswordInput() {
    const [confirmPassword, setConfirmPassword] = useAtom(confirmPasswordAtom)
    const [error, setError] = useAtom(confirmPasswordErrorAtom)
    const focus = useAtomValue(passwordFocusAtom)
    const password = useAtomValue(passwordAtom)

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
            required
            label='Confirm Password'
            type='password'
            name='password-confirm'
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
