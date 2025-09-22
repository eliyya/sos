'use client'

import { LABORATORY_TYPE } from '@/prisma/enums'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { ClockIcon, MicroscopeIcon, Save, SquarePenIcon } from 'lucide-react'
import { useState, useTransition } from 'react'
import { editLaboratory } from '@/actions/laboratory'
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
import {
    editDialogAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/management-laboratory'
import { secondsToTime } from '@/lib/utils'

const labTypeLabel = {
    [LABORATORY_TYPE.LABORATORY]: 'Laboratorio',
    [LABORATORY_TYPE.COMPUTER_CENTER]: 'Centro de Cómputo',
}

export function EditDialog() {
    const [open, setOpen] = useAtom(editDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(entityToEditAtom)
    const [message, setMessage] = useState('')
    const updateUsersTable = useSetAtom(updateAtom)

    if (!old) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Laboratorio</DialogTitle>
                    <DialogDescription>
                        Edita el laboratorio {old.name}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await editLaboratory(data)
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
                        <Save className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
