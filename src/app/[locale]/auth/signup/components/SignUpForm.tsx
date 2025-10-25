'use client'

import app from '@eliyya/type-routes'
import {
    AtSignIcon,
    LogIn,
    RectangleEllipsisIcon,
    UserIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { getAdminRole } from '@/actions/roles.actions'
import { Button } from '@/components/Button'
import { MessageError } from '@/components/Error'
import { authClient } from '@/lib/auth-client'
import { capitalize, cn, truncateByUnderscore } from '@/lib/utils'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    canSuggestUsernameAtom,
    confirmPasswordAtom,
    confirmPasswordErrorAtom,
    nameAtom,
    nameErrorAtom,
    passwordAtom,
    passwordErrorAtom,
    usernameAtom,
    usernameErrorAtom,
} from '@/global/signup'
import { CompletInput } from '@/components/Inputs'
import { useTranslations } from 'next-intl'

export function SignUpForm() {
    const [error, setError] = useState('')
    const [pending, startTransition] = useTransition()
    const { push } = useRouter()
    const setPasswordError = useSetAtom(passwordErrorAtom)
    const setConfirmPasswordError = useSetAtom(confirmPasswordAtom)

    return (
        <form
            action={(formData: FormData) =>
                startTransition(async () => {
                    const username = (formData.get('username') as string).trim()
                    const password = (formData.get('password') as string).trim()
                    const name = capitalize(
                        (formData.get('name') as string).trim(),
                    )
                    const check = checkPassword(password)
                    if (check?.error) {
                        return setPasswordError(
                            'La contraseña debe contener al menos 10 caracteres',
                        )
                    }
                    if (password !== formData.get('confirm-password')) {
                        return setConfirmPasswordError(
                            'Las contraseñas no coinciden',
                        )
                    }

                    const adminRole = await getAdminRole()
                    if (!adminRole) return setError('Something went wrong')

                    const { error } = await authClient.signUp.email({
                        email: `${username}@noemail.local`,
                        password,
                        name,
                        username,
                        role_id: adminRole.id,
                    })
                    if (!error) return push(app.dashboard())
                    setError('Algo salió mal')
                    console.log(error)
                })
            }
            className='flex w-full max-w-md flex-col justify-center gap-6'
        >
            <h2 className='text-3xl font-bold text-gray-800 md:text-4xl dark:text-gray-100'>
                Bienvenido Admin
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
                Crear tu cuenta de administrador
            </p>

            {error && <MessageError>{error}</MessageError>}

            <NameInput />
            <UsernameInput />
            <PasswordInput />
            <ConfirmPasswordInput />

            <Button
                type='submit'
                disabled={pending}
                className={cn(
                    'w-full rounded-lg bg-linear-to-r from-yellow-500 to-yellow-600 py-3 font-semibold text-white',
                    'hover:from-yellow-600 hover:to-yellow-700 focus:ring-4 focus:ring-yellow-400',
                )}
            >
                <LogIn className='mr-2 h-5 w-5' />
                Crear cuenta
            </Button>
        </form>
    )
}

function checkPassword(password: string) {
    if (password.length < 10)
        return {
            error: 'La contraseña debe tener al menos 10 caracteres',
        }
    if (!/[A-Z]/.test(password))
        return {
            error: 'La contraseña debe contener al menos una mayúscula',
        }
    if (!/[0-9]/.test(password))
        return {
            error: 'La contraseña debe contener al menos un número',
        }
    if (!/[!@#$%^&*.-_]/.test(password))
        return {
            error: 'La contraseña debe contener al menos un carácter especial como !@#$%^&*',
        }
}

function PasswordInput() {
    const t = useTranslations('auth')
    const [password, setPassword] = useAtom(passwordAtom)
    const [error, setError] = useAtom(passwordErrorAtom)

    const onBlur = () => {
        if (!password) return
        const check = checkPassword(password)
        if (check?.error) return setError(check.error)
    }

    return (
        <CompletInput
            required
            label={t('password')}
            type='password'
            name='password'
            placeholder='* * * * * * * * * *'
            onBlur={onBlur}
            value={password}
            error={error}
            onChange={e => {
                setPassword(e.target.value)
                setError('')
            }}
            icon={RectangleEllipsisIcon}
        />
    )
}

function ConfirmPasswordInput() {
    const t = useTranslations('auth')
    const [confirmPassword, setConfirmPassword] = useAtom(confirmPasswordAtom)
    const [error, setError] = useAtom(confirmPasswordErrorAtom)
    const password = useAtomValue(passwordAtom)

    const onBlur = () => {
        if (!confirmPassword || !password) return
        if (confirmPassword !== password)
            setError('Las contraseñas no coinciden')
        else setError('')
    }

    return (
        <CompletInput
            required
            label={t('confirm_password')}
            type='password'
            name='confirm-password'
            placeholder='* * * * * * * *'
            value={confirmPassword}
            error={error}
            onBlur={onBlur}
            onChange={e => {
                setConfirmPassword(e.target.value)
                setError('')
            }}
            icon={RectangleEllipsisIcon}
        />
    )
}

export function UsernameInput() {
    const t = useTranslations('auth')
    const [username, setUsername] = useAtom(usernameAtom)
    const [error, setError] = useAtom(usernameErrorAtom)
    const setCanSuggestUsername = useSetAtom(canSuggestUsernameAtom)
    const [focus, setFocus] = useState(false)

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (!username) return
            const isAv = await authClient.isUsernameAvailable({ username })
            if (!isAv) setError('El usuario no esta disponible')
        }, 500)

        return () => clearTimeout(handler)
    }, [username, setError])

    return (
        <CompletInput
            required
            label={t('user')}
            type='text'
            name='username'
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
            icon={AtSignIcon}
        />
    )
}

export function NameInput() {
    const t = useTranslations('auth')
    const [name, setName] = useAtom(nameAtom)
    const [error, setError] = useAtom(nameErrorAtom)
    const setUsername = useSetAtom(usernameAtom)
    const canSuggestUsername = useAtomValue(canSuggestUsernameAtom)

    return (
        <CompletInput
            required
            label={t('name')}
            type='text'
            name='name'
            placeholder='Nombre'
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
            icon={UserIcon}
        />
    )
}
