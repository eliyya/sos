'use client'

import { LogIn } from 'lucide-react'
import { Button } from '@/components/Button'
import { useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { MessageError } from '@/components/Error'
import { authClient } from '@/lib/auth-client'
import { getAdminRole } from '@/actions/roles'
import { UsernameInput } from './inputs/UsernameInput'
import { PasswordInput } from './inputs/PasswordInput'
import { ConfirmPasswordInput } from './inputs/ConfirmPasswordInput'
import { NameInput } from './inputs/NameInput'

export function SignUpForm() {
    const [error, setError] = useState('')
    const [pending, startTransition] = useTransition()
    const { push } = useRouter()

    return (
        <form
            action={(formData: FormData) =>
                startTransition(async () => {
                    const username = formData.get('username') as string
                    const password = formData.get('password') as string
                    const name = formData.get('name') as string

                    const { id: role_id } = await getAdminRole()
                    if (!role_id) return setError('Something went wrong')

                    const { error } = await authClient.signUp.email({
                        email: `${username}@noemail.local`,
                        password,
                        name,
                        username,
                        role_id,
                    })
                    if (!error) return push(app.auth.login())
                    setError('Something went wrong')
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
