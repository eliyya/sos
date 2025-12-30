import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className='flex min-h-screen min-w-screen flex-col items-center justify-center gap-4'>
            <h1 className='text-5xl'>Not Found</h1>
            <p className='text-xl'>Esta página no existe</p>
            <Button render={<Link href='/'>Return Home</Link>} />
        </div>
    )
}
