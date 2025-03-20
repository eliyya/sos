import { BeakerIcon } from 'lucide-react'
import Link from 'next/link'
import app from '@eliyya/type-routes'
import { getPaylodadUser } from '@/actions/auth'
import { Suspense } from 'react'
import { RoleBitField } from '@/bitfields/RoleBitField'

export function Header() {
    return (
        <header className='bg-primary/10 py-6'>
            <nav className='container mx-auto flex items-center justify-between px-4'>
                <Link href={app()} className='flex items-center gap-2'>
                    <BeakerIcon className='text-primary h-8 w-8' />
                    <span className='text-1xl text-foreground font-bold'>
                        SOS
                    </span>
                </Link>
                <div className='flex gap-4'>
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
    const user = await getPaylodadUser()
    if (!user) return <Link href={app.login()}>Iniciar Sesión</Link>
    return null
}

async function HeaderAdmin() {
    const user = await getPaylodadUser()
    if (!user) return null
    if (!new RoleBitField(BigInt(user.role)).has([RoleBitField.Flags.Admin]))
        return null
    return <Link href={app.admin.dashboard()}>Admin</Link>
}
