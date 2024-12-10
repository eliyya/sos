import { BeakerIcon } from 'lucide-react'
import Link from 'next/link'
import app from '@eliyya/type-routes'
import { getUser } from '@/actions/auth'
import { Suspense } from 'react'
import { RoleBitField } from '@/lib/RoleBitField'

export function Header() {
    return (
        <header className="bg-primary/10 py-6">
            <nav className="container mx-auto px-4 flex justify-between items-center">
                <Link href={app()} className="flex items-center gap-2">
                    <BeakerIcon className="h-8 w-8 text-primary" />
                    <span className="text-1xl font-bold text-foreground">
                        SOS
                    </span>
                </Link>
                <div className="flex gap-4">
                    <Suspense>
                        <HeaderLogin />
                    </Suspense>
                    <Suspense>
                        <HeaderAdmin />
                    </Suspense>
                </div>
            </nav>
        </header>
    )
}

async function HeaderLogin() {
    const user = await getUser()
    if (!user) return <Link href={app.login()}>Iniciar Sesión</Link>
    return null
}

async function HeaderAdmin() {
    const user = await getUser()
    if (!user) return null
    if (!new RoleBitField(user.roles).has([RoleBitField.Flags.Admin]))
        return null
    return <Link href={app.admin.dashboard()}>Admin</Link>
}
