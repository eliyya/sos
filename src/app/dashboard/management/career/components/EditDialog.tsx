'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Save, SquarePenIcon, TagIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { editCareer } from '@/actions/career'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { RetornableCompletInput } from '@/components/Inputs'
import {
    editDialogAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/management-career'
import { useTranslations } from 'next-intl'

export function EditDialog() {
    const [open, setOpen] = useAtom(editDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)
    const t = useTranslations('career')

    if (!old) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('edit_career')}</DialogTitle>
                    <DialogDescription>
                        {t('edit_career_name', { 'old.name': old.name })}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await editCareer(data)
                            if (error) setMessage(error)
                            else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    500,
                                )
                                setOpen(false)
                            }
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && <MessageError>{message}</MessageError>}
                    <input type='hidden' value={old.id} name='id' />
                    <RetornableCompletInput
                        originalValue={old.name}
                        required
                        label={t('name')}
                        type='text'
                        name='name'
                        icon={SquarePenIcon}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={old.alias ?? ''}
                        required
                        label={t('alias')}
                        type='text'
                        name='alias'
                        icon={TagIcon}
                    ></RetornableCompletInput>
                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        {t('save')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
