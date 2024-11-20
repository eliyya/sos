import { db } from '@/lib/db'
import { root } from '@eliyya/type-routes'
import { redirect } from 'next/navigation'
import { RegisterForm } from './RegisterForm'

export default async function LoginPage() {
    const usuario = await db.users.count()
    if (usuario > 0) redirect(root.login())
    return (
        <main className="flex flex-1 justify-center items-center ">
            <RegisterForm />
        </main>
    )
}
