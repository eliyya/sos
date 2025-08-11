import { APP_NAME } from '@/constants/client'
import { SignUpForm } from './components/SignUpForm'
import { db } from '@/prisma/db'
import { notFound } from 'next/navigation'

export default async function LoginPage() {
    const users = await db.user.count()
    if (users > 0) return notFound()
    return (
        <main className='bg-background flex min-h-screen items-center justify-center'>
            <div className='flex flex-col items-center justify-center gap-6 rounded-3xl border p-10 shadow-2xl md:p-16'>
                <span className='text-5xl font-extrabold'>{APP_NAME}</span>
                <SignUpForm />
            </div>
        </main>
    )
}
