'use client'

import app from '@eliyya/type-routes'
import { LogIn, RectangleEllipsisIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { getAdminRole } from '@/actions/roles.actions'
import { Button } from '@/components/Button'
import { MessageError } from '@/components/Error'
import { authClient } from '@/lib/auth-client'
import { capitalize, cn } from '@/lib/utils'
import { NameInput } from './inputs/NameInput'
import { UsernameInput } from './inputs/UsernameInput'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    confirmPasswordAtom,
    confirmPasswordErrorAtom,
    passwordAtom,
    passwordErrorAtom,
    passwordFocusAtom,
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
                    'w-full rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 py-3 font-semibold text-white',
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
    const t = useTranslations('app.auth.login.components.loginForm')
    const [pass, setUsername] = useAtom(passwordAtom)
    const [error, setError] = useAtom(passwordErrorAtom)
    const setFocus = useSetAtom(passwordFocusAtom)

    return (
        <CompletInput
            required
            label={t('pass')}
            type='password'
            name='password'
            placeholder={t('username-placeholder')}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            value={pass}
            error={error}
            onChange={e => {
                const password = e.target.value
                setUsername(e.target.value)
                setError('')
                if (!password) return
                const check = checkPassword(password)
                if (check?.error) return setError(check.error)
            }}
            icon={RectangleEllipsisIcon}
        />
    )
}

function ConfirmPasswordInput() {
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
            label={'Confirmar contraseña'}
            type='password'
            name='confirm-password'
            placeholder='* * * * * * * *'
            value={confirmPassword}
            error={error}
            onChange={e => {
                setConfirmPassword(e.target.value)
                setError('')
            }}
            icon={RectangleEllipsisIcon}
        />
    )
}
