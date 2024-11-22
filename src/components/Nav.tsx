import Image from 'next/image'
import Link from 'next/link'
import logo from '@/img/logo_sistemas.png'

export function Nav() {
    return (
        <header className="bg-white text-black flex flex-row justify-between p-4 items-center">
            <div className="flex gap-1 flex-1 items-centea">
                <Image alt="logo" src={logo} className="w-8 h-8" />
                <nav className="flex gap-1">
                    <Link href="/"> Home</Link>
                    <Link href="/admin">Admin</Link>
                </nav>
            </div>
            <div>laboratorio 1</div>
            <div className="flex-1 flex justify-end">
                <Image alt="perfil" src={logo} className="w-8 h-8" />
            </div>
        </header>
    )
}
