'use client'

import { LABORATORY_TYPE } from '@prisma/client'
import { useAtom, useSetAtom } from 'jotai'
import { Clock8Icon, MicroscopeIcon, Save, SquarePenIcon } from 'lucide-react'
import { useState, useTransition } from 'react'

import { createlab } from '@/actions/laboratory'
import { Button } from '@/components/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { CompletInput } from '@/components/Inputs'
import { CompletSelect } from '@/components/Select'
import {
    closeHourAtom,
    errorNameAtom,
    errorOpenHourAtom,
    nameAtom,
    openCreateAtom,
    openHourAtom,
    openUnarchiveOrDeleteAtom,
    updateAtom,
    errorTypeAtom,
    typeAtom,
    errorCloseHourAtom,
} from '@/global/management-laboratory'
import { CLOCK_ICONS, ClockIcons, Hours } from '@/lib/clock'

export function CreateLaboratoryDialog() {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const updateUsersTable = useSetAtom(updateAtom)
    const setNameError = useSetAtom(errorNameAtom)
    const setOpenError = useSetAtom(errorOpenHourAtom)
    const setOpenUnarchiveOrDelete = useSetAtom(openUnarchiveOrDeleteAtom)
    const setName = useSetAtom(nameAtom)
    const setOpenHour = useSetAtom(openHourAtom)
    const setCloseHour = useSetAtom(closeHourAtom)

    return (
        <Dialog
            open={open}
            onOpenChange={open => {
                setOpen(open)
                if (!open) {
                    setName('')
                    setNameError('')
                    setOpenHour('08:00')
                    setCloseHour('20:00')
                    setOpenError('')
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Laboratorio</DialogTitle>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const { error, message } = await createlab(data)
                            if (!error) {
                                setTimeout(
                                    () => updateUsersTable(Symbol()),
                                    500,
                                )
                                setName('')
                                setNameError('')
                                setOpenHour('08:00')
                                setCloseHour('20:00')
                                setOpenError('')
                                return setOpen(false)
                            }
                            if (error === 'ALREADY_EXISTS') {
                                if (
                                    message ===
                                    'El laboratorio se encuentra archivado'
                                ) {
                                    setOpen(false)
                                    setOpenUnarchiveOrDelete(true)
                                    setName('')
                                    setNameError('')
                                    setOpenHour('08:00')
                                    setCloseHour('20:00')
                                    setOpenError('')
                                } else {
                                    setNameError(message)
                                }
                            } else if (error === 'DATA_ERROR') {
                                setOpenError(message)
                            } else {
                                setMessage(message)
                                setTimeout(() => {
                                    setMessage('')
                                }, 5_000)
                            }
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && <MessageError>{message}</MessageError>}
                    <NameInput />
                    <OpenHourInput />
                    <CloseHourInput />
                    <LaboratoryTypeSelect />

                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Crear
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function NameInput() {
    const [name, setName] = useAtom(nameAtom)
    const [error, setError] = useAtom(errorNameAtom)

    return (
        <CompletInput
            required
            label='Nombre'
            type='text'
            name='name'
            icon={SquarePenIcon}
            value={name}
            onChange={e => {
                setName(e.target.value)
                setError('')
            }}
            error={error}
        />
    )
}

export function LaboratoryTypeSelect() {
    const [value, setValue] = useAtom(typeAtom)
    const [error, setError] = useAtom(errorTypeAtom)

    return (
        <CompletSelect
            required
            label='Tipo de Laboratorio'
            name='type'
            value={value}
            onChange={e => {
                setValue({
                    value: e?.value ?? LABORATORY_TYPE.LABORATORY,
                    label: e?.label ?? LABORATORY_TYPE.LABORATORY,
                })
                setError('')
            }}
            error={error}
            options={[
                {
                    value: LABORATORY_TYPE.LABORATORY,
                    label: 'Laboratorio',
                },
                {
                    value: LABORATORY_TYPE.COMPUTER_CENTER,
                    label: 'Centro de Computo',
                },
            ]}
            icon={MicroscopeIcon}
        />
    )
}

export function OpenHourInput() {
    const [value, setValue] = useAtom(openHourAtom)
    const [error, setError] = useAtom(errorOpenHourAtom)
    const [Icon, setIcon] = useState<ClockIcons>(Clock8Icon)

    return (
        <CompletInput
            required
            label='Apertura'
            type='time'
            name='open_hour'
            icon={Icon}
            value={value}
            onChange={e => {
                setValue(e.target.value)
                setError('')
                const hour = e.target.value.split(':')[0]
                setIcon(CLOCK_ICONS[`${hour}:00` as Hours])
            }}
            error={error}
        />
    )
}

export function CloseHourInput() {
    const [value, setValue] = useAtom(closeHourAtom)
    const [error, setError] = useAtom(errorCloseHourAtom)
    const [Icon, setIcon] = useState<ClockIcons>(Clock8Icon)

    return (
        <CompletInput
            required
            label='Cierre'
            type='time'
            name='close_hour'
            icon={Icon}
            value={value}
            onChange={e => {
                setValue(e.target.value)
                setError('')
                const hour = e.target.value.split(':')[0]
                setIcon(CLOCK_ICONS[`${hour}:00` as Hours])
            }}
            error={error}
        />
    )
}
