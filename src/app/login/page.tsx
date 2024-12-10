import { Card } from '@/components/ui/card'
import { BeakerIcon } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import LoginForm from './LoginForm'

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex flex-1 items-center justify-center">
                <Card className="w-full max-w-md p-8">
                    <div className="flex flex-col items-center mb-8">
                        <Link href="/" className="flex items-center gap-2 mb-8">
                            <BeakerIcon className="h-8 w-8 text-primary" />
                            <span className="text-2xl font-bold">
                                System of systems
                            </span>
                        </Link>
                        <h1 className="text-2xl font-semibold">
                            Iniciar Sesión
                        </h1>
                    </div>

                    <LoginForm />

                    <p className="mt-6 text-center text-sm text-primary">
                        ¿No tienes una cuenta? Contacta con un administrador
                    </p>
                </Card>
            </main>
        </div>
    )
}
