'use client'

import { useAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { errorAtom } from '@/global/cc'
import { useTranslations } from 'next-intl'

export function ErrorDialog() {
    const [error, setError] = useAtom(errorAtom)
    const t = useTranslations('cc')

    return (
        <Dialog open={!!error}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('error')}</DialogTitle>
                    <DialogDescription className='animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md'>
                        {error}
                    </DialogDescription>
                </DialogHeader>
                <Button onClick={() => setError('')} className='mt-4'>
                    {t('understood')}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
