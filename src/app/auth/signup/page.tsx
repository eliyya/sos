import { APP_NAME } from '@/constants/client'
import { SignUpForm } from './components/SignUpForm'

export default async function LoginPage() {
    return (
        <main className='bg-background flex min-h-screen items-center justify-center'>
            <div className='flex flex-col items-center justify-center gap-6 rounded-3xl border p-10 shadow-2xl md:p-16'>
                <span className='text-5xl font-extrabold'>{APP_NAME}</span>
                <SignUpForm />
            </div>
        </main>
    )
}
