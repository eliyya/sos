'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/Button'
import { login } from '@/actions/users'
import app from '@eliyya/type-routes'
import { CompletInput } from '@/components/Inputs'

const formSchema = z.object({
    username: z.string(),
    password: z.string().min(8, {
        message: 'La contraseña debe tener al menos 8 caracteres.',
    }),
})

export default function LoginForm() {
    const router = useRouter()
    const [isLoading, startTransition] = useTransition()

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                await login(values)
                // router.push(app())
            } catch (error) {
                if (
                    (error as Error).message === 'Password or user incorrect' ||
                    (error as Error).message.startsWith(
                        'Password has been changued',
                    )
                )
                    alert('credenciales incorrectas')
                else alert('Ah ocurrido un error. Por favor intenta más tarde')
            }
        })
    }

    return (
        <form className='space-y-6'>
            <CompletInput name='username' label='username' />
            <CompletInput name='password' label='contrasenia' />
            <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
        </form>
    )
}
