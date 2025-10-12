'use client'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Save, SquarePenIcon, TagIcon } from 'lucide-react'
import { useCallback, useState, useTransition } from 'react'
import { editCareer } from '@/actions/careers.actions'
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
import { openDialogAtom, selectedCareerAtom } from '@/global/careers.globals'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { useCareers } from '@/hooks/careers.hooks'

const nameErrorAtom = atom('')
const aliasErrorAtom = atom('')

export function EditDialog() {
    const [open, setOpen] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(selectedCareerAtom)
    const [message, setMessage] = useState('')
    const t = useTranslations('career')
    const router = useRouter()
    const { setCareers } = useCareers()
    // errors
    const setNameError = useSetAtom(nameErrorAtom)
    const setAliasError = useSetAtom(aliasErrorAtom)

    const onAction = useCallback(
        (data: FormData) => {
            if (!old) return
            const name = data.get('name') as string
            const alias = data.get('alias') as string

            startTransition(async () => {
                const response = await editCareer({
                    id: old.id,
                    name,
                    alias,
                })
                if (response.status === 'success') {
                    setCareers(prev =>
                        prev.map(career =>
                            career.id === old.id ?
                                { ...career, name, alias }
                            :   career,
                        ),
                    )
                    setOpen(null)
                } else {
                    if (response.type === 'permission') {
                        setMessage(
                            'You do not have permission to edit this career',
                        )
                        setTimeout(() => setMessage(''), 5_000)
                    } else if (response.type === 'unauthorized') {
                        router.replace(app.auth.login())
                    } else if (response.type === 'not-found') {
                        setMessage(response.message)
                        setTimeout(() => setMessage(''), 5_000)
                    } else if (response.type === 'invalid-input') {
                        if (response.field === 'name') {
                            setNameError(response.message)
                        } else if (response.field === 'alias') {
                            setAliasError(response.message)
                        }
                    } else {
                        setMessage('Something went wrong')
                        setTimeout(() => setMessage(''), 5_000)
                    }
                }
            })
        },
        [old, setCareers, setOpen, router, setNameError, setAliasError],
    )

    if (!old) return null

    return (
        <Dialog
            open={open === 'EDIT'}
            onOpenChange={status => {
                if (!status) setOpen(null)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('edit_career')}</DialogTitle>
                    <DialogDescription>
                        {t('edit_career_name', { 'old.name': old.name })}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && <MessageError>{message}</MessageError>}

                    <NameInput />
                    <AliasInput />

                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        {t('save')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function NameInput() {
    const t = useTranslations('career')
    const old = useAtomValue(selectedCareerAtom)
    const nameError = useAtomValue(nameErrorAtom)

    if (!old) return null
    return (
        <RetornableCompletInput
            originalValue={old.name}
            required
            label={t('name')}
            type='text'
            name='name'
            icon={SquarePenIcon}
            error={nameError}
        />
    )
}

function AliasInput() {
    const t = useTranslations('career')
    const old = useAtomValue(selectedCareerAtom)
    const aliasError = useAtomValue(aliasErrorAtom)

    if (!old) return null
    return (
        <RetornableCompletInput
            originalValue={old.alias ?? ''}
            required
            label={t('alias')}
            type='text'
            name='alias'
            icon={TagIcon}
            error={aliasError}
        />
    )
}
