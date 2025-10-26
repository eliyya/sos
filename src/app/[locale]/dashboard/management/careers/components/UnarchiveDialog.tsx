'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArchiveRestore, Ban } from 'lucide-react'
import { useCallback, useState, useTransition } from 'react'
import { unarchiveCareer } from '@/actions/careers.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { openDialogAtom, selectedCareerAtom } from '@/global/careers.globals'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { STATUS } from '@/prisma/generated/enums'
import { useCareers } from '@/hooks/careers.hooks'

export function UnarchiveDialog() {
    const [open, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedCareerAtom)
    const [message, setMessage] = useState('')
    const t = useTranslations('career')
    const router = useRouter()
    const { setCareers } = useCareers()

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const response = await unarchiveCareer(entity.id)
            if (response.status === 'success') {
                setCareers(prev =>
                    prev.map(career =>
                        career.id === entity.id ?
                            { ...career, status: STATUS.ACTIVE }
                        :   career,
                    ),
                )
                openDialog(null)
            } else {
                if (response.type === 'permission') {
                    setMessage(
                        'You do not have permission to unarchive this career',
                    )
                    setTimeout(() => setMessage(''), 5_000)
                } else if (response.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (response.type === 'not-found') {
                    setMessage(response.message)
                    setTimeout(() => setMessage(''), 5_000)
                } else {
                    setMessage('Something went wrong')
                    setTimeout(() => setMessage(''), 5_000)
                }
            }
        })
    }, [openDialog, router, entity, setCareers])

    if (!entity) return null

    return (
        <Dialog
            open={open === 'UNARCHIVE'}
            onOpenChange={state => {
                if (!state) openDialog(null)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('unarchive_career')}</DialogTitle>
                    <DialogDescription>
                        {t('confirm_unarchive', { 'entity.name': entity.name })}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            variant={'secondary'}
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                openDialog(null)
                            }}
                        >
                            <Ban className='mr-2 h-5 w-5' />
                            {t('cancell')}
                        </Button>
                        <Button
                            type='submit'
                            variant={'default'}
                            disabled={inTransition}
                        >
                            <ArchiveRestore className='mr-2 h-5 w-5' />
                            {t('unarchive')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
