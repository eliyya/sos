'use client'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Activity, use, useCallback, useState, useTransition } from 'react'
import { createCareer } from '@/actions/careers.actions'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { MessageError } from '@/components/Error'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useTranslations } from 'next-intl'
import app from '@eliyya/type-routes'
import { useRouter } from 'next/navigation'
import { SearchCareersContext } from '@/contexts/careers.context'
import { CompletField } from '@/components/ui/complet-field'
import { SquarePenIcon, TagIcon } from 'lucide-react'

const errorNameAtom = atom('')
const errorAliasAtom = atom('')

export function CreateCareerDialog() {
    const [open, openDialog] = useAtom(dialogAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const t = useTranslations('career')
    const router = useRouter()
    const setSelectedId = useSetAtom(selectedIdAtom)
    const { refresh } = use(SearchCareersContext)

    const setErrorName = useSetAtom(errorNameAtom)
    const setErrorAlias = useSetAtom(errorAliasAtom)

    const onAction = useCallback(
        (data: FormData) => {
            const name = data.get('name') as string
            const alias = data.get('alias') as string

            startTransition(async () => {
                const res = await createCareer({ name, alias })
                if (res.status === 'success') {
                    openDialog(null)
                    refresh()
                    return
                }
                if (res.type === 'already-archived') {
                    setSelectedId(res.id)
                    openDialog('UNARCHIVE_OR_DELETE')
                } else if (res.type === 'permission') {
                    setMessage('No tienes permiso para crear esta carrera')
                } else if (res.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (res.type === 'invalid-input') {
                    if (res.field === 'name') {
                        setErrorName(res.message)
                    } else if (res.field === 'alias') {
                        setErrorAlias(res.message)
                    }
                } else if (res.type === 'already-exists') {
                    setErrorName('Ya existe una carrera con este nombre')
                } else if (res.type === 'unexpected') {
                    setMessage(
                        'Ha ocurrido un error inesperado, intente mas tarde',
                    )
                }
            })
        },
        [
            openDialog,
            refresh,
            router,
            setSelectedId,
            setErrorName,
            setErrorAlias,
        ],
    )

    return (
        <Dialog
            open={open === 'CREATE'}
            onOpenChange={state => openDialog(state ? 'CREATE' : null)}
        >
            <DialogContent>
                <form action={onAction}>
                    <DialogHeader>
                        <DialogTitle>{t('create_career')}</DialogTitle>
                    </DialogHeader>

                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>

                    <NameInput />
                    <AliasInput />

                    <DialogFooter>
                        <DialogClose
                            render={<Button variant='outline'>Cancel</Button>}
                        />
                        <Button type='submit' disabled={inTransition}>
                            {t('create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function NameInput() {
    const error = useAtomValue(errorNameAtom)
    return (
        <CompletField
            label='Nombre'
            name='name'
            icon={SquarePenIcon}
            type='text'
            error={error}
            required
        />
    )
}

function AliasInput() {
    const error = useAtomValue(errorAliasAtom)
    return (
        <CompletField
            label='Alias'
            name='alias'
            icon={TagIcon}
            type='text'
            error={error}
            required
        />
    )
}
