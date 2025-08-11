'use client'

import { LogIn, RectangleEllipsis, User } from 'lucide-react'
import { CompletInput } from '@/components/Inputs'
import { Button } from '@/components/Button'
import { useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { useAtom, useSetAtom } from 'jotai'
import { usernameAtom, LoginDialogAtom, passwordAtom } from '../global/login'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { MessageError } from '@/components/Error'
import { authClient } from '@/lib/auth-client'

export function LoginForm() {
    const t = useTranslations('app.auth.login.components.loginForm')
    const [username, setUsername] = useAtom(usernameAtom)
    const [password, setPassword] = useAtom(passwordAtom)
    const [error, setError] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [pending, startTransition] = useTransition()
    const { replace } = useRouter()

    return (
        <form
            action={data => {
                startTransition(async () => {
                    const { data, error } = await authClient.signIn.username({
                        username: username,
                        password: password,
                        rememberMe: true,
                    })
                    console.log({ data, error })
                    if (!error) {
                        replace(app.dashboard())
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
