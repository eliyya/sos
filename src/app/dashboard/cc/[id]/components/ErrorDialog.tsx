'use client'

import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { errorAtom } from '@/global/cc'
import { useAtom } from 'jotai'

export function ErrorDialog() {
    const [error, setError] = useAtom(errorAtom)

    return (
        <Dialog open={!!error}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Error</DialogTitle>
                    <DialogDescription className='animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md'>
                        {error}
                    </DialogDescription>
                </DialogHeader>
                <Button onClick={() => setError('')} className='mt-4'>Entendido</Button>
            </DialogContent>
        </Dialog>
    )
}
