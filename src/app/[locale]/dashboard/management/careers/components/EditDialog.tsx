'use client'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Save, SquarePenIcon, TagIcon } from 'lucide-react'
import {
    Activity,
    Suspense,
    use,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
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
import { openDialogAtom, selectedCareerIdAtom } from '@/global/careers.globals'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchCareersContext } from '@/contexts/careers.context'

const nameErrorAtom = atom('')
const aliasErrorAtom = atom('')

function EditDialog() {
    const [open, setOpen] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const oldId = useAtomValue(selectedCareerIdAtom)
    const [message, setMessage] = useState('')
    const t = useTranslations('career')
    const router = useRouter()
    // errors
    const setNameError = useSetAtom(nameErrorAtom)
    const setAliasError = useSetAtom(aliasErrorAtom)
    const { careersPromise, refreshCareers } = use(SearchCareersContext)
    const { careers } = use(careersPromise)

    const old = useMemo(
        () => careers.find(c => c.id === oldId),
        [careers, oldId],
    )

    const onAction = useCallback(
        (data: FormData) => {
            if (!oldId) return
            const name = data.get('name') as string
            const alias = data.get('alias') as string

            startTransition(async () => {
                const response = await editCareer({
                    id: oldId,
                    name,
                    alias,
                })
                if (response.status === 'success') {
                    refreshCareers()
                    setOpen(null)
                } else {
                    if (response.type === 'permission') {
                        setMessage(
                            'You do not have permission to edit this career',
                        )
                        setTimeout(() => setMessage(''), 5_000)
                    } else if (response.type === 'unauthorized') {
                        router.replace(app.$locale.auth.login('es'))
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
        [oldId, refreshCareers, setOpen, router, setNameError, setAliasError],
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
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>

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
    const oldId = useAtomValue(selectedCareerIdAtom)
    const nameError = useAtomValue(nameErrorAtom)
    const { careersPromise } = use(SearchCareersContext)
    const { careers } = use(careersPromise)

    const old = useMemo(
        () => careers.find(c => c.id === oldId),
        [careers, oldId],
    )

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
    const oldId = useAtomValue(selectedCareerIdAtom)
    const aliasError = useAtomValue(aliasErrorAtom)
    const { careersPromise } = use(SearchCareersContext)
    const { careers } = use(careersPromise)

    const old = useMemo(
        () => careers.find(c => c.id === oldId),
        [careers, oldId],
    )

    if (!old) return null
    return (
        <RetornableCompletInput
            originalValue={old.alias}
            required
            label={t('alias')}
            type='text'
            name='alias'
            icon={TagIcon}
            error={aliasError}
        />
    )
}

function SuspenseEditDialog() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditDialog />
        </Suspense>
    )
}

export { SuspenseEditDialog as EditDialog }
