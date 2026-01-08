'use client'

import { LABORATORY_TYPE } from '@/prisma/generated/enums'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    ClockIcon,
    MicroscopeIcon,
    SaveIcon,
    SquarePenIcon,
} from 'lucide-react'
import {
    Activity,
    Suspense,
    use,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { MessageError } from '@/components/Error'
import { RetornableCompletInput } from '@/components/Inputs'
import { RetornableCompletSelect } from '@/components/Select'
import { secondsToTime } from '@/lib/utils'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { editLaboratory } from '@/actions/laboratories.actions'
import { useRouter } from 'next/navigation'
import { SearchLaboratoriesContext } from '@/contexts/laboratories.context'
import { Skeleton } from '@mantine/core'

function getLabTypeLabel(t: (key: any) => string, type: LABORATORY_TYPE) {
    return type === LABORATORY_TYPE.LABORATORY ?
            t('laboratory_type')
        :   t('computer_center_type')
}

export function EditDialog() {
    const t = useTranslations('laboratories')
    const [dialogOpened, openDialog] = useAtom(dialogAtom)

    return (
        <Dialog
            open={dialogOpened === 'EDIT'}
            onOpenChange={state => {
                if (!state) openDialog(null)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('edit_title')}</DialogTitle>
                    {/* <DialogDescription>
                        {t('edit_description')} {old.name}
                    </DialogDescription> */}
                </DialogHeader>
                <Suspense fallback={<EditFormSkeleton />}>
                    <EditForm />
                </Suspense>
            </DialogContent>
        </Dialog>
    )
}

function EditForm() {
    const t = useTranslations('laboratories')
    const tCommon = useTranslations('common')
    const openDialog = useSetAtom(dialogAtom)
    const [inTransition, startTransition] = useTransition()
    const [message, setMessage] = useState('')
    const labId = useAtomValue(selectedIdAtom)
    const router = useRouter()
    const { refresh, promise } = use(SearchLaboratoriesContext)
    const { laboratories } = use(promise)

    const old = useMemo(
        () => laboratories?.find(lab => lab.id === labId),
        [labId, laboratories],
    )

    const onAction = useCallback(
        (data: FormData) => {
            const name = data.get('name') as string
            const close_hour = Number(data.get('close_hour'))
            const open_hour = Number(data.get('open_hour'))
            const type = data.get('type') as LABORATORY_TYPE
            if (!old) return
            startTransition(async () => {
                const response = await editLaboratory({
                    id: old.id,
                    name,
                    close_hour,
                    open_hour,
                    type,
                })
                if (response.status === 'success') {
                    refresh()
                    openDialog(null)
                } else {
                    if (response.type === 'already-exists') {
                        setMessage(t('laboratory_exists'))
                    } else if (response.type === 'invalid-input') {
                        setMessage(response.message)
                    } else if (response.type === 'not-found') {
                        refresh()
                        openDialog(null)
                    } else if (response.type === 'permission') {
                        setMessage(t('no_permission_edit'))
                    } else if (response.type === 'unauthorized') {
                        router.replace('/login')
                    } else if (response.type === 'unexpected') {
                        setMessage(tCommon('unexpected_error'))
                    }
                }
            })
        },
        [old, openDialog, router, refresh, t, tCommon],
    )

    if (!old) return null

    return (
        <form
            action={onAction}
            className='flex w-full max-w-md flex-col justify-center gap-6'
        >
            <Activity mode={message ? 'visible' : 'hidden'}>
                <MessageError>{message}</MessageError>
            </Activity>
            <input type='hidden' value={old.id} name='id' />
            <RetornableCompletInput
                required
                label={t('name_label')}
                type='text'
                name='name'
                originalValue={old.name}
                icon={SquarePenIcon}
            ></RetornableCompletInput>
            <RetornableCompletInput
                required
                label={t('opening')}
                type='time'
                name='open_hour'
                originalValue={secondsToTime(old.open_hour * 60)}
                icon={ClockIcon}
            ></RetornableCompletInput>
            <RetornableCompletInput
                required
                label={t('closing')}
                type='time'
                name='close_hour'
                originalValue={secondsToTime(old.close_hour * 60)}
                icon={ClockIcon}
            ></RetornableCompletInput>
            <RetornableCompletSelect
                label={t('type_label')}
                name='type'
                originalValue={{
                    value: old.type,
                    label: getLabTypeLabel(t, old.type),
                }}
                options={[
                    {
                        value: LABORATORY_TYPE.LABORATORY,
                        label: getLabTypeLabel(t, LABORATORY_TYPE.LABORATORY),
                    },
                    {
                        value: LABORATORY_TYPE.COMPUTER_CENTER,
                        label: getLabTypeLabel(
                            t,
                            LABORATORY_TYPE.COMPUTER_CENTER,
                        ),
                    },
                ]}
                icon={MicroscopeIcon}
            />
            <Button type='submit' disabled={inTransition}>
                <SaveIcon className='mr-2 h-5 w-5' />
                {tCommon('save')}
            </Button>
        </form>
    )
}

function EditFormSkeleton() {
    return (
        <div className='flex w-full max-w-md flex-col justify-center gap-6'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
        </div>
    )
}
