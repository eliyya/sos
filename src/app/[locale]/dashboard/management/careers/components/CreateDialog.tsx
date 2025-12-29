'use client'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Save, TagIcon, SquarePenIcon } from 'lucide-react'
import { Activity, use, useCallback, useState, useTransition } from 'react'
import { createCareer } from '@/actions/careers.actions'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { CompletInput } from '@/components/Inputs'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useTranslations } from 'next-intl'
import app from '@eliyya/type-routes'
import { useRouter } from 'next/navigation'
import { SearchCareersContext } from '@/contexts/careers.context'

const nameAtom = atom('')
const aliasAtom = atom('')
const nameErrorAtom = atom('')
const aliasErrorAtom = atom('')

export function CreateCareerDialog() {
    const [open, openDialog] = useAtom(dialogAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const t = useTranslations('career')
    const router = useRouter()
    const setSelectedId = useSetAtom(selectedIdAtom)
    const { refresh } = use(SearchCareersContext)
    // values
    const setName = useSetAtom(nameAtom)
    const setAlias = useSetAtom(aliasAtom)
    // errors
    const setNameError = useSetAtom(nameErrorAtom)
    const setAliasError = useSetAtom(aliasErrorAtom)

    const onAction = useCallback(
        (data: FormData) => {
            const name = data.get('name') as string
            const alias = data.get('alias') as string

            startTransition(async () => {
                const response = await createCareer({ name, alias })
                if (response.status === 'success') {
                    openDialog(null)
                    setName('')
                    setAlias('')
                    refresh()
                    return
                }
                // error
                if (response.type === 'permission') {
                    setMessage(
                        'You do not have permission to archive this career',
                    )
                    setTimeout(() => setMessage(''), 5_000)
                } else if (response.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (response.type === 'already-archived') {
                    openDialog('UNARCHIVE_OR_DELETE')
                    setSelectedId(response.id)
                } else if (response.type === 'invalid-input') {
                    if (response.field === 'name')
                        setNameError(response.message)
                    if (response.field === 'alias')
                        setAliasError(response.message)
                } else {
                    setMessage('Something went wrong')
                    setTimeout(() => setMessage(''), 5_000)
                }
            })
        },
        [
            openDialog,
            refresh,
            router,
            setSelectedId,
            setNameError,
            setAliasError,
            setName,
            setAlias,
        ],
    )

    return (
        <Dialog
            open={open === 'CREATE'}
            onOpenChange={status => {
                if (!status) openDialog(null)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('create_career')}</DialogTitle>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <NameInput />
                    <AliasInput />

                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        {t('create')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function NameInput() {
    const t = useTranslations('career')
    const [name, setName] = useAtom(nameAtom)
    const nameError = useAtomValue(nameErrorAtom)
    return (
        <CompletInput
            required
            label={t('name')}
            type='text'
            name='name'
            icon={SquarePenIcon}
            value={name}
            onChange={e => setName(e.target.value)}
            error={nameError}
        />
    )
}

function AliasInput() {
    const t = useTranslations('career')
    const [alias, setAlias] = useAtom(aliasAtom)
    const aliasError = useAtomValue(aliasErrorAtom)
    return (
        <CompletInput
            label={t('alias')}
            type='text'
            name='alias'
            icon={TagIcon}
            value={alias}
            onChange={e => setAlias(e.target.value)}
            error={aliasError}
        />
    )
}
