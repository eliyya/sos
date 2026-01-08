'use client'

import { useAtom } from 'jotai'
import { CheckCheckIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { dialogAtom } from '@/global/management.globals'

export function PreventArchiveAdminDialog() {
    const t = useTranslations('users')
    const tc = useTranslations('common')
    const [open, setOpen] = useAtom(dialogAtom)

    return (
        <Dialog
            open={open === 'PREVENT_ARCHIVE_ADMIN'}
            onOpenChange={op => setOpen(op ? 'PREVENT_ARCHIVE_ADMIN' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('prevent_archive_title')}</DialogTitle>
                    <DialogDescription>
                        {t('prevent_archive_message')}
                    </DialogDescription>
                </DialogHeader>
                <span>{t('prevent_archive_suggestion')}</span>
                <form
                    action={() => setOpen(null)}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button type='submit'>
                            <CheckCheckIcon className='mr-2 h-5 w-5' />
                            {tc('understood')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
