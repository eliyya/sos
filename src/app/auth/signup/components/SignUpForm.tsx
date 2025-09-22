'use client'

import app from '@eliyya/type-routes'
import { LogIn } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { getAdminRole } from '@/actions/roles.actions'
import { Button } from '@/components/Button'
import { MessageError } from '@/components/Error'
import { authClient } from '@/lib/auth-client'
import { capitalize, cn } from '@/lib/utils'
import { ConfirmPasswordInput } from './inputs/ConfirmPasswordInput'
import { NameInput } from './inputs/NameInput'
import { PasswordInput } from './inputs/PasswordInput'
import { UsernameInput } from './inputs/UsernameInput'

export function SignUpForm() {
    const [error, setError] = useState('')
    const [pending, startTransition] = useTransition()
    const { push } = useRouter()

    return (
        <form
            action={(formData: FormData) =>
                startTransition(async () => {
                    const username = (formData.get('username') as string).trim()
                    const password = (formData.get('password') as string).trim()
                    const name = capitalize(
                        (formData.get('name') as string).trim(),
                    )

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
