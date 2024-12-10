'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    FormProvider,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { login } from '@/actions/users'
import app from '@eliyya/type-routes'

const formSchema = z.object({
    username: z.string(),
    password: z.string().min(8, {
        message: 'La contraseña debe tener al menos 8 caracteres.',
    }),
})

export default function LoginForm() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, startTransition] = useTransition()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                await login(values)
                router.push(app())
            } catch (error) {
                if (
                    (error as Error).message === 'Password or user incorrect' ||
                    (error as Error).message.startsWith(
                        'Password has been changued',
                    )
                )
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description:
                            'Credenciales inválidas. Por favor intente nuevamente.',
                    })
                else
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description:
                            'Ah ocurrido un error. Por favor intenta más tarde',
                    })
            }
        })
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="teacher123" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contraseña</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
            </form>
        </FormProvider>
    )
}
