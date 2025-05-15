'use client'

import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from '@/components/Dialog'
import { errorAtom } from '@/global/cc'
import { useAtom } from 'jotai'

export function ErrorDialog() {
    const [error, setError] = useAtom(errorAtom)

    return (
        <Dialog open={!!error}>
            <DialogContent>
                <DialogTitle>
                    <span className='text-3xl'>Error</span>
                </DialogTitle>
                <DialogDescription className='animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md'>
                    {error}
                </DialogDescription>
                <Button onClick={() => setError('')}>Entendido</Button>
            </DialogContent>
        </Dialog>
    )
}
