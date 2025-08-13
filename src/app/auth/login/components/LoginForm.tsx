'use client'

import { LogIn } from 'lucide-react'
import { Button } from '@/components/Button'
import { useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { MessageError } from '@/components/Error'
import { authClient } from '@/lib/auth-client'
import { UsernameInput } from './inputs/UsernameInput'
import { PasswordInput } from './inputs/PasswordInput'
import { useSetAtom } from 'jotai'
import { usernameAtom, passwordAtom } from '@/global/login'

export function LoginForm() {
    const t = useTranslations('app.auth.login.components.loginForm')
    const [error, setError] = useState('')
    const [pending, startTransition] = useTransition()
    const { push } = useRouter()
    const setUsername = useSetAtom(usernameAtom)
    const setPassword = useSetAtom(passwordAtom)

    return (
        <form
            action={formData =>
                startTransition(async () => {
                    const username = formData.get('username') as string
                    const password = formData.get('password') as string
                    const { error } = await authClient.signIn.username({
                        username,
                        password,
                    })
                    if (!error) {
                        setUsername('')
                        setPassword('')
                        return push(app.dashboard())
                    }
                    if (error.code === 'invalid username or password')
                        setError(error.message!)
                    else setError('Something went wrong')
                })
            }
            className='flex w-full max-w-md flex-col justify-center gap-6'
        >
            <h2 className='text-3xl font-bold text-gray-800 md:text-4xl dark:text-gray-100'>
                {t('welcome')}
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
                {t('sub')}
            </p>

            {error && <MessageError>{error}</MessageError>}

            <UsernameInput />
            <PasswordInput />

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
