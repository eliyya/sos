'use client'

import { editLaboratory } from '@/actions/laboratory'
import { Button } from '@/components/Button'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import { RetornableCompletInput } from '@/components/Inputs'
import { RetornableCompletSelect } from '@/components/Select'
import {
    editDialogAtom,
    entityToEditAtom,
    updateAtom,
} from '@/global/managment-laboratory'
import { secondsToTime } from '@/lib/utils'
import { LABORATORY_TYPE } from '@prisma/client'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Save, User } from 'lucide-react'
import { useState, useTransition } from 'react'
const labTypeLabel = {
    [LABORATORY_TYPE.LABORATORY]: 'Laboratorio',
    [LABORATORY_TYPE.COMPUTER_CENTER]: 'Centro de Computo',
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
                <DialogTitle>
                    <span className='text-3xl'>Editar Laboratorio</span>
                </DialogTitle>
                <DialogDescription>
                    Edita el laboratorio {old.name}
                </DialogDescription>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error } = await editLaboratory(data)
                            if (error) setMessage(error)
                            else {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    1_000,
                                )
                                setOpen(false)
                            }
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && (
                        <span className='animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md'>
                            {message}
                        </span>
                    )}
                    <input type='hidden' value={old.id} name='id' />
                    <RetornableCompletInput
                        required
                        label='Nombre'
                        type='text'
                        name='name'
                        defaultValue={old.name}
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        required
                        label='Apertura'
                        type='time'
                        name='open_hour'
                        defaultValue={secondsToTime(old.open_hour * 60)}
                        // TODO : fix this
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        required
                        label='Cierre'
                        type='time'
                        name='close_hour'
                        defaultValue={secondsToTime(old.close_hour * 60)}
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletSelect
                        label='Tipo de Laboratorio'
                        name='type'
                        defaultValue={{
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
                        icon={User}
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
