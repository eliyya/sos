'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArchiveRestoreIcon, BanIcon, TrashIcon } from 'lucide-react'
import { Activity, useCallback, useState, useTransition } from 'react'
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
import { useCareers } from '@/hooks/careers.hooks'
import { useRouter } from 'next/router'
import app from '@eliyya/type-routes'
import { STATUS } from '@/prisma/generated/enums'
import { CompletInput } from '@/components/Inputs'

export function UnarchiveOrDeleteDialog() {
    const [open, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedCareerAtom)
    const [message, setMessage] = useState('')
    const t = useTranslations('career')
    const { setCareers } = useCareers()
    const router = useRouter()

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
            open={open === 'UNARCHIVE_OR_DELETE'}
            onOpenChange={state => {
                if (!state) openDialog(null)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('archived_career')}</DialogTitle>
                    <DialogDescription>
                        {t('unarchive_or_delete_description', {
                            'entity.name': entity.name,
                        })}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <CompletInput
                        label={t('name')}
                        disabled
                        value={entity.name}
                    />
                    <CompletInput
                        label={t('alias')}
                        disabled
                        value={entity.alias}
                    />
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            type='button'
                            variant='secondary'
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                openDialog(null)
                            }}
                        >
                            <BanIcon className='mr-2 h-5 w-5' />
                            {t('cancell')}
                        </Button>
                        <Button
                            type='submit'
                            variant='default'
                            disabled={inTransition}
                        >
                            <ArchiveRestoreIcon className='mr-2 h-5 w-5' />
                            {t('unarchive')}
                        </Button>
                        <Button
                            type='button'
                            variant='destructive'
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                openDialog('DELETE')
                            }}
                        >
                            <TrashIcon className='mr-2 h-5 w-5' />
                            {t('delete')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
