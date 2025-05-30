'use client'

import { LogIn, RectangleEllipsis, User } from 'lucide-react'
import { CompletInput } from '@/components/Inputs'
import { Button } from '@/components/Button'
import { login, refreshToken as refreshTokenAction } from '@/actions/auth'
import { useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { LoginFormStatus } from '@/lib/types'
import { useAtom, useSetAtom } from 'jotai'
import { usernameAtom, LoginDialogAtom, passwordAtom } from '../global/login'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { useDevice } from '@/hooks/useDevice'
import { MessageError } from '@/components/Error'

export function LoginForm() {
    const t = useTranslations('app.auth.login.components.loginForm')
    const setOpen = useSetAtom(LoginDialogAtom)
    const [username, setUsername] = useAtom(usernameAtom)
    const [password, setPassword] = useAtom(passwordAtom)
    const [error, setError] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [pending, startTransition] = useTransition()
    const { replace } = useRouter()
    const { browser, device, os, model } = useDevice()

    return (
        <form
            action={data => {
                startTransition(async () => {
                    const {
                        refreshToken = '',
                        status,
                        errors,
                        message,
                    } = await login(data, { browser, device, os, model })
                    if (status === LoginFormStatus.auth) {
                        return setOpen(true)
                    } else if (status === LoginFormStatus.error) {
                        if (errors?.username) setUsernameError(errors.username)
                        if (errors?.password) setPasswordError(errors.password)
                        if (message) setError(message)
                        setTimeout(() => {
                            setUsernameError('')
                            setPasswordError('')
                            setError('')
                        }, 5000)
                        return
                    } else if (status === LoginFormStatus.success) {
                        const r = await refreshTokenAction({ refreshToken })
                        if (!r.error) {
                            replace(app.dashboard())
                        }
                    }
                })
            }}
            className='flex w-full max-w-md flex-col justify-center gap-6'
        >
            <h2 className='text-3xl font-bold text-gray-800 md:text-4xl dark:text-gray-100'>
                {t('welcome')}
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
                {t('sub')}
            </p>

            {error && <MessageError>{error}</MessageError>}
            <CompletInput
                required
                label={t('username')}
                type='text'
                name='username'
                placeholder={t('username-placeholder')}
                value={username}
                onChange={e => {
                    setUsername(e.target.value)
                    setUsernameError('')
                }}
                error={usernameError}
                icon={User}
            />
            <CompletInput
                required
                label={t('pass')}
                type='password'
                name='password'
                placeholder='* * * * * * * *'
                value={password}
                onChange={e => {
                    setPassword(e.target.value)
                    setPasswordError('')
                }}
                error={passwordError}
                icon={RectangleEllipsis}
            />

            <Button
                type='submit'
                disabled={pending}
                className={cn(
                    'w-full rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 py-3 font-semibold text-white',
                    'hover:from-yellow-600 hover:to-yellow-700 focus:ring-4 focus:ring-yellow-400',
                )}
            >
                <LogIn className='mr-2 h-5 w-5' />
                {t('login')}
            </Button>
        </form>
    )
}
