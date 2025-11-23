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
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { RetornableCompletInput } from '@/components/Inputs'
import { RetornableCompletSelect } from '@/components/Select'
import { secondsToTime } from '@/lib/utils'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { editLaboratory } from '@/actions/laboratories.actions'
import { useRouter } from 'next/navigation'
import { SearchLaboratoriesContext } from '@/contexts/laboratories.context'
import { Skeleton } from '@mantine/core'

const labTypeLabel = {
    [LABORATORY_TYPE.LABORATORY]: 'Laboratorio',
    [LABORATORY_TYPE.COMPUTER_CENTER]: 'Centro de Cómputo',
}

export function EditDialog() {
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
                    <DialogTitle>Editar Laboratorio</DialogTitle>
                    {/* <DialogDescription>
                        Edita el laboratorio {old.name}
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
                        setMessage('El laboratorio ya existe')
                    } else if (response.type === 'invalid-input') {
                        setMessage(response.message)
                    } else if (response.type === 'not-found') {
                        refresh()
                        openDialog(null)
                    } else if (response.type === 'permission') {
                        setMessage(
                            'No tienes permiso para editar este laboratorio',
                        )
                    } else if (response.type === 'unauthorized') {
                        router.replace('/login')
                    } else if (response.type === 'unexpected') {
                        setMessage('Ha ocurrido un error, intente más tarde')
                    }
                }
            })
        },
        [old, openDialog, router, refresh],
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
                label='Nombre'
                type='text'
                name='name'
                originalValue={old.name}
                icon={SquarePenIcon}
            ></RetornableCompletInput>
            <RetornableCompletInput
                required
                label='Apertura'
                type='time'
                name='open_hour'
                originalValue={secondsToTime(old.open_hour * 60)}
                icon={ClockIcon}
            ></RetornableCompletInput>
            <RetornableCompletInput
                required
                label='Cierre'
                type='time'
                name='close_hour'
                originalValue={secondsToTime(old.close_hour * 60)}
                icon={ClockIcon}
            ></RetornableCompletInput>
            <RetornableCompletSelect
                label='Tipo de Laboratorio'
                name='type'
                originalValue={{
                    value: old.type,
                    label: labTypeLabel[old.type],
                }}
                options={[
                    {
                        value: LABORATORY_TYPE.LABORATORY,
                        label: labTypeLabel[LABORATORY_TYPE.LABORATORY],
                    },
                    {
                        value: LABORATORY_TYPE.COMPUTER_CENTER,
                        label: labTypeLabel[LABORATORY_TYPE.COMPUTER_CENTER],
                    },
                ]}
                icon={MicroscopeIcon}
            />
            <Button type='submit' disabled={inTransition}>
                <SaveIcon className='mr-2 h-5 w-5' />
                Save
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
