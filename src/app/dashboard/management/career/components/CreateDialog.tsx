'use client'

import { useAtom, useSetAtom } from 'jotai'
import { Save, TagIcon, SquarePenIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { createCareer } from '@/actions/career'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { CompletInput } from '@/components/Inputs'
import {
    entityToEditAtom,
    openCreateAtom,
    updateAtom,
} from '@/global/management-career'
import { useTranslations } from 'next-intl'

export function CreateSubjectDialog() {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateAtom)
    const setEntityToEdit = useSetAtom(entityToEditAtom)
    const t = useTranslations('career')

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('create_career')}</DialogTitle>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error, career } = await createCareer(data)

                            if (error === 'La carrera esta archivada') {
                                setMessage(error)
                                setEntityToEdit(career)
                            } else if (error) {
                                setMessage(error)
                            } else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    500,
                                )
                                setOpen(false)
                            }
                            setTimeout(() => {
                                setMessage('')
                            }, 5_000)
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && <MessageError>{message}</MessageError>}
                    <CompletInput
                        required
                        label={t('name')}
                        type='text'
                        name='name'
                        icon={SquarePenIcon}
                    />
                    <CompletInput
                        label={t('alias')}
                        type='text'
                        name='alias'
                        icon={TagIcon}
                    />

                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        {t('create')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
