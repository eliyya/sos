'use client'

import { LogIn, Mail, RectangleEllipsis } from 'lucide-react'
import { CompletInput } from '@/components/Inputs'
import { Button } from '@/components/Button'
import { login, refreshToken as refreshTokenAction } from '@/actions/auth'
import { useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { LoginFormStatus } from '@/lib/types'
import { useAtom, useSetAtom } from 'jotai'
import { emailAtom, LoginDialogAtom, passwordAtom } from '../global/login'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { getMyIp } from '@/lib/ip'
import { getDeviceInfo } from '@/lib/device'
import { idb } from '@/lib/idb'

export function LoginForm() {
    const t = useTranslations('app.auth.login.components.loginForm')
    const setOpen = useSetAtom(LoginDialogAtom)
    const [email, setEmail] = useAtom(emailAtom)
    const [password, setPassword] = useAtom(passwordAtom)
    const [error, setError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [pending, startTransition] = useTransition()
    const { replace } = useRouter()

    return (
        <form
            action={data => {
                startTransition(async () => {
                    const { ip } = await getMyIp()
                    const { browser, device, os, model } = getDeviceInfo()
                    const {
                        refreshToken = '',
                        status,
                        errors,
                        message,
                    } = await login(data, { ip, browser, device, os, model })
                    if (status === LoginFormStatus.auth) {
                        return setOpen(true)
                    } else if (status === LoginFormStatus.error) {
                        if (errors?.username) setEmailError(errors.username)
                        if (errors?.password) setPasswordError(errors.password)
                        if (message) setError(message)
                        return
                    } else if (status === LoginFormStatus.success) {
                        const r = await refreshTokenAction({ refreshToken })
                        if (!r.error) {
                            // save agent in idb
                            idb.user.clear().then(async () => {
                                // redirect to dashboard
                                replace(app.admin.dashboard())
                            })
                            // const catFrom = await syncCategoriesFromDB()
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

            {error && (
                <span className='block text-sm font-medium text-red-500'>
                    {error}
                </span>
            )}
            <CompletInput
                required
                label={t('mail')}
                type='email'
                name='email'
                placeholder={t('email-placeholder')}
                value={email}
                onChange={e => {
                    setEmail(e.target.value)
                    setEmailError('')
                }}
                error={emailError}
            >
                <Mail className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
            </CompletInput>
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
            >
                <RectangleEllipsis className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
            </CompletInput>

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
