'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Archive, Ban } from 'lucide-react'
import { Activity, Suspense, useCallback, useState, useTransition } from 'react'
import { archiveCareer } from '@/actions/careers.actions'
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
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { STATUS } from '@/prisma/generated/enums'
import { CompletInput } from '@/components/Inputs'

function SuspenseArchiveDialog() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ArchiveDialog />
        </Suspense>
    )
}

export { SuspenseArchiveDialog as ArchiveDialog }

function ArchiveDialog() {
    const [open, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedCareerAtom)
    const [message, setMessage] = useState('')
    const t = useTranslations('career')
    const { setCareers } = useCareers()
    const router = useRouter()

    const onAction = useCallback(() => {
        startTransition(async () => {
            if (!entity) return
            const response = await archiveCareer(entity.id)
            if (response.status === 'success') {
                openDialog(null)
                setCareers(prev =>
                    prev.map(career =>
                        career.id === entity.id ?
                            { ...career, status: STATUS.ARCHIVED }
                        :   career,
                    ),
                )
                return
            }
            // error
            if (response.type === 'not-found') {
                setMessage('Career not found')
                setTimeout(() => setMessage(''), 5_000)
            } else if (response.type === 'permission') {
                setMessage('You do not have permission to archive this career')
                setTimeout(() => setMessage(''), 5_000)
            } else if (response.type === 'unauthorized') {
                setMessage('You do not have permission to archive this career')
                setTimeout(() => setMessage(''), 5_000)
                router.replace(app.$locale.auth.login('es'))
            } else {
                setMessage('Something went wrong')
                setTimeout(() => setMessage(''), 5_000)
            }
        })
    }, [entity, openDialog, setCareers, router])

    if (!entity) return null

    return (
        <Dialog
            open={open === 'ARCHIVE'}
            onOpenChange={state => {
                if (!state) openDialog(null)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('archive_career')}</DialogTitle>
                    <DialogDescription>
                        {t('confirm', { name: entity.name })}
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
                            variant={'destructive'}
                            disabled={inTransition}
                        >
                            <Archive className='mr-2 h-5 w-5' />
                            {t('archive')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
