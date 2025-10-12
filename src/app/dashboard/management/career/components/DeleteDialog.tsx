'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Ban, Trash2 } from 'lucide-react'
import { useCallback, useState, useTransition } from 'react'
import { deleteCareer } from '@/actions/careers.actions'
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
import app from '@eliyya/type-routes'
import { useRouter } from 'next/navigation'
import { useCareers } from '@/hooks/careers.hooks'

export function DeleteDialog() {
    const [open, setOpen] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedCareerAtom)
    const [message, setMessage] = useState('')
    const t = useTranslations('career')
    const router = useRouter()
    const { setCareers } = useCareers()

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const response = await deleteCareer(entity.id)
            if (response.status === 'success') {
                setCareers(prev =>
                    prev.filter(career => career.id !== entity.id),
                )
                setOpen(null)
            } else {
                if (response.type === 'permission') {
                    setMessage(
                        'You do not have permission to delete this career',
                    )
                    setTimeout(() => setMessage(''), 5_000)
                } else if (response.type === 'unauthorized') {
                    router.replace(app.auth.login())
                } else if (response.type === 'not-found') {
                    setMessage(response.message)
                    setTimeout(() => setMessage(''), 5_000)
                } else {
                    setMessage('Something went wrong')
                    setTimeout(() => setMessage(''), 5_000)
                }
            }
        })
    }, [setOpen, router, entity, setCareers])

    if (!entity) return null

    return (
        <Dialog
            open={open === 'DELETE'}
            onOpenChange={state => {
                if (!state) setOpen(null)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('delete_career')}</DialogTitle>
                    <DialogDescription>
                        {t('confirm_delete', { 'entity.name': entity.name })}{' '}
                        <strong>{t('is_irreversible')}</strong>
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && <MessageError>{message}</MessageError>}
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                setOpen(null)
                            }}
                        >
                            <Ban className='mr-2 h-5 w-5' />
                            {t('cancell')}
                        </Button>
                        <Button
                            type='submit'
                            variant={'destructive'}
                            disabled={inTransition}
                        >
                            <Trash2 className='mr-2 h-5 w-5' />
                            {t('delete')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
