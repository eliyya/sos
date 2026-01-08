'use client'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Activity, use, useCallback, useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { createLaboratory } from '@/actions/laboratories.actions'
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
import { LABORATORY_TYPE } from '@/prisma/generated/enums'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchLaboratoriesContext } from '@/contexts/laboratories.context'
import { CompletField } from '@/components/ui/complet-field'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Clock8Icon, SquarePenIcon } from 'lucide-react'

const errorNameAtom = atom('')
const errorOpenHourAtom = atom('')
const errorCloseHourAtom = atom('')
const errorTypeAtom = atom('')

export function CreateLaboratoryDialog() {
    const t = useTranslations('laboratories')
    const tCommon = useTranslations('common')
    const [open, openDialog] = useAtom(dialogAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const setEntityToEdit = useSetAtom(selectedIdAtom)
    const router = useRouter()
    const { refresh } = use(SearchLaboratoriesContext)

    const setErrorName = useSetAtom(errorNameAtom)
    const setErrorOpenHour = useSetAtom(errorOpenHourAtom)
    const setErrorCloseHour = useSetAtom(errorCloseHourAtom)
    const setErrorType = useSetAtom(errorTypeAtom)

    const onAction = useCallback(
        (data: FormData) => {
            const name = data.get('name') as string
            const open_hour = parseInt(data.get('open_hour') as string)
            const close_hour = parseInt(data.get('close_hour') as string)
            const type = data.get('type') as LABORATORY_TYPE

            startTransition(async () => {
                const res = await createLaboratory({
                    name,
                    open_hour,
                    close_hour,
                    type,
                })
                if (res.status === 'success') {
                    openDialog(null)
                    refresh()
                    return
                }
                if (res.type === 'already-archived') {
                    setEntityToEdit(res.id)
                    openDialog('UNARCHIVE_OR_DELETE')
                } else if (res.type === 'permission') {
                    setMessage(t('no_permission_create'))
                } else if (res.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (res.type === 'invalid-input') {
                    if (res.field === 'name') {
                        setErrorName(res.message)
                    } else if (res.field === 'open_hour') {
                        setErrorOpenHour(res.message)
                    } else if (res.field === 'close_hour') {
                        setErrorCloseHour(res.message)
                    } else if (res.field === 'type') {
                        setErrorType(res.message)
                    }
                } else if (res.type === 'already-exists') {
                    setErrorName(t('already_exists'))
                } else if (res.type === 'unexpected') {
                    setMessage(tCommon('unexpected_error'))
                }
            })
        },
        [
            openDialog,
            refresh,
            router,
            setEntityToEdit,
            setErrorName,
            setErrorOpenHour,
            setErrorCloseHour,
            setErrorType,
            t,
            tCommon,
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
                        <DialogTitle>{t('create_title')}</DialogTitle>
                    </DialogHeader>

                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>

                    <NameInput />
                    <TypeInput />
                    <div className='flex w-full gap-4'>
                        <OpenHourInput />
                        <CloseHourInput />
                    </div>

                    <DialogFooter>
                        <DialogClose
                            render={
                                <Button variant='outline'>
                                    {tCommon('cancel')}
                                </Button>
                            }
                        />
                        <Button type='submit' disabled={inTransition}>
                            {tCommon('create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function NameInput() {
    const t = useTranslations('laboratories')
    const error = useAtomValue(errorNameAtom)
    return (
        <CompletField
            label={t('name_label')}
            name='name'
            icon={SquarePenIcon}
            type='text'
            error={error}
            required
        />
    )
}

function TypeInput() {
    const t = useTranslations('laboratories')
    const error = useAtomValue(errorTypeAtom)
    return (
        <Field>
            <FieldLabel>{t('type_label')}</FieldLabel>
            <Select name='type' defaultValue={LABORATORY_TYPE.LABORATORY}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={LABORATORY_TYPE.LABORATORY}>
                        {t('laboratory_type')}
                    </SelectItem>
                    <SelectItem value={LABORATORY_TYPE.COMPUTER_CENTER}>
                        {t('computer_center_type')}
                    </SelectItem>
                </SelectContent>
            </Select>
            <FieldError errors={error ? [{ message: error }] : []} />
        </Field>
    )
}

function OpenHourInput() {
    const t = useTranslations('laboratories')
    const error = useAtomValue(errorOpenHourAtom)
    return (
        <CompletField
            label={t('opening_hours')}
            name='open_hour'
            icon={Clock8Icon}
            type='time'
            defaultValue='08:00'
            error={error}
            required
        />
    )
}

function CloseHourInput() {
    const t = useTranslations('laboratories')
    const error = useAtomValue(errorCloseHourAtom)
    return (
        <CompletField
            label={t('closing_hours')}
            name='close_hour'
            icon={Clock8Icon}
            type='time'
            defaultValue='18:00'
            error={error}
            required
        />
    )
}
