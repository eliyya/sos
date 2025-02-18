import { Card } from '@/components/Card'
import { BeakerIcon } from 'lucide-react'
import Link from 'next/link'
// import { Header } from '@/components/Header'
import LoginForm from './LoginForm'

export default function LoginPage() {
    return (
        <div className='bg-background flex min-h-screen flex-col'>
            {/* <Header /> */}
            <main className='flex flex-1 items-center justify-center'>
                <Card className='w-full max-w-md p-8'>
                    <div className='mb-8 flex flex-col items-center'>
                        <Link href='/' className='mb-8 flex items-center gap-2'>
                            <BeakerIcon className='text-primary h-8 w-8' />
                            <span className='text-2xl font-bold'>
                                System of systems
                            </span>
                        </Link>
                        <h1 className='text-2xl font-semibold'>
                            Iniciar Sesión
                        </h1>
                    </div>

                    <LoginForm />

                    <p className='text-primary mt-6 text-center text-sm'>
                        ¿No tienes una cuenta? Contacta con un administrador
                    </p>
                </Card>
            </main>
        </div>
    )
}
