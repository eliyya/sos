'use client'

import { LABORATORY_TYPE } from '@/prisma/generated/enums'
import { useAtom, useAtomValue } from 'jotai'
import {
    ClockIcon,
    MicroscopeIcon,
    SaveIcon,
    SquarePenIcon,
} from 'lucide-react'
import { Activity, useCallback, useState, useTransition } from 'react'
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
import { RetornableCompletSelect } from '@/components/Select'
import { secondsToTime } from '@/lib/utils'
import {
    openDialogAtom,
    selectedLaboratoryAtom,
} from '@/global/laboratories.globals'
import { editLaboratory } from '@/actions/laboratories.actions'
import { useLaboratories } from '@/hooks/laboratories.hoohs'
import { useRouter } from 'next/navigation'

const labTypeLabel = {
    [LABORATORY_TYPE.LABORATORY]: 'Laboratorio',
    [LABORATORY_TYPE.COMPUTER_CENTER]: 'Centro de Cómputo',
}

export function EditDialog() {
    const [dialogOpened, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(selectedLaboratoryAtom)
    const [message, setMessage] = useState('')
    const { setLaboratories, refetchLaboratories } = useLaboratories()
    const router = useRouter()

    const onAction = useCallback(
        ({
            name,
            close_hour,
            open_hour,
            type,
        }: {
            name?: string
            close_hour?: number
            open_hour?: number
            type?: LABORATORY_TYPE
        }) => {
            if (!old) return
            startTransition(async () => {
                const response = await editLaboratory({
                    name,
                    close_hour,
                    open_hour,
                    type,
                })
                if (response.status === 'success') {
                    setLaboratories(labs =>
                        labs.map(lab =>
                            lab.id !== old.id ? lab : response.laboratory,
                        ),
                    )
                    openDialog(null)
                } else {
                    if (response.type === 'already-exists') {
                        setMessage('El laboratorio ya existe')
                    } else if (response.type === 'invalid-input') {
                        setMessage(response.message)
                    } else if (response.type === 'not-found') {
                        await refetchLaboratories()
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
        [old, openDialog, setLaboratories, router, refetchLaboratories],
    )

    if (!old) return null

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
                    <DialogDescription>
                        Edita el laboratorio {old.name}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        const name = data.get('name') as string
                        const close_hour = Number(data.get('close_hour'))
                        const open_hour = Number(data.get('open_hour'))
                        const type = data.get('type') as LABORATORY_TYPE
                        onAction({ name, close_hour, open_hour, type })
                    }}
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
                                label: labTypeLabel[
                                    LABORATORY_TYPE.COMPUTER_CENTER
                                ],
                            },
                        ]}
                        icon={MicroscopeIcon}
                    />
                    <Button type='submit' disabled={inTransition}>
                        <SaveIcon className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
