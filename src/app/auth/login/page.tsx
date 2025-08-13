import { APP_NAME } from '@/constants/client'
import { LoginForm } from './components/LoginForm'
import { db } from '@/prisma/db'
import { redirect } from 'next/navigation'
import app from '@eliyya/type-routes'

export default async function LoginPage() {
    const usersCount = await db.user.count()
    if (usersCount == 0) return redirect(app.auth.signup())

    return (
        <main className='bg-background flex min-h-screen items-center justify-center'>
            <div className='flex flex-col items-center justify-center gap-6 rounded-3xl border p-10 shadow-2xl md:p-16'>
                <span className='text-5xl font-extrabold'>{APP_NAME}</span>
                <LoginForm />
            </div>
        </main>
    )
}
