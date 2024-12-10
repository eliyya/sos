import { BeakerIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Header() {
    return (
        <header className="bg-primary/10 py-6">
            <nav className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <BeakerIcon className="h-8 w-8 text-primary" />
                    <span className="text-1xl font-bold text-foreground">
                        LabReserve
                    </span>
                </Link>
                <div className="flex gap-4">
                    <Button variant="ghost">Iniciar Sesión</Button>
                    <Button>Registrarse</Button>
                </div>
            </nav>
        </header>
    )
}
