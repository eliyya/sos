'use client'

import { atom, useAtom } from 'jotai'
import { AtSignIcon, LogIn, RectangleEllipsisIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Activity, ReactNode, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { MessageError } from '@/components/Error'
import { CompletInput } from '@/components/Inputs'
import { loginAction } from '@/actions/auth.actions'
import app from '@eliyya/type-routes'

export const usernameAtom = atom('')
export const passwordAtom = atom('')

type Props = {
    children?: ReactNode
}
export function LoginForm({ children }: Props) {
    const t = useTranslations('auth')

    const [error, setError] = useState('')
    const [pending, startTransition] = useTransition()
    const router = useRouter()

    return (
        <form
            action={formData =>
                startTransition(async () => {
                    const username = formData.get('username') as string
                    const password = formData.get('password') as string
                    const res = await loginAction({ username, password })
                    if (res.status == 'success') {
                        router.replace(app.$locale.dashboard('es'))
                        return
                    }
                    if (res.type === 'invalid-credentials') {
                        setError(res.message)
                    } else if (res.type === 'unexpected') {
                        setError('Something went wrong')
                    }
                })
            }
            className='flex w-full max-w-md flex-col justify-center gap-6'
        >
            <h2 className='text-3xl font-bold text-gray-800 md:text-4xl dark:text-gray-100'>
                {t('welcome_title')}
            </h2>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
                {t('welcome_message')}
            </p>
            {children}

            <Activity mode={error ? 'visible' : 'hidden'}>
                <MessageError>{error}</MessageError>
            </Activity>

            <UsernameInput />
            <PasswordInput />

            <Button type='submit' disabled={pending}>
                <LogIn className='mr-2 h-5 w-5' />
                {t('login')}
            </Button>
        </form>
    )
}

export function PasswordInput() {
    const t = useTranslations('auth')
    const [password, setPassword] = useAtom(passwordAtom)
    return (
        <CompletInput
            required
            label={t('password')}
            type='password'
            name='password'
            placeholder='* * * * * * * *'
            icon={RectangleEllipsisIcon}
            value={password}
            onChange={e => setPassword(e.target.value)}
        />
    )
}

export function UsernameInput() {
    const t = useTranslations('auth')
    const [username, setUsername] = useAtom(usernameAtom)
    return (
        <CompletInput
            required
            label={t('user')}
            type='text'
            name='username'
            icon={AtSignIcon}
            value={username}
            onChange={e => setUsername(e.target.value)}
        />
    )
}
