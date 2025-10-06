'use client'

import { LABORATORY_TYPE } from '@/prisma/generated/browser'
import { useAtom, useSetAtom } from 'jotai'
import {
    Clock8Icon,
    MicroscopeIcon,
    SaveIcon,
    SquarePenIcon,
} from 'lucide-react'
import { useCallback, useState, useTransition } from 'react'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { CompletInput } from '@/components/Inputs'
import { CompletSelect } from '@/components/Select'
import { CLOCK_ICONS, ClockIcons, Hours } from '@/lib/clock'
import {
    closeHourAtom,
    errorCloseHourAtom,
    errorNameAtom,
    errorOpenHourAtom,
    errorTypeAtom,
    nameAtom,
    openDialogAtom,
    openHourAtom,
    selectedLaboratoryIdAtom,
    typeAtom,
} from '@/global/laboratories.globals'
import { createLaboratory } from '@/actions/laboratories.actions'
import { useLaboratories } from '@/hooks/laboratories.hoohs'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

export function CreateLaboratoryDialog() {
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const [dialogOpened, openDialog] = useAtom(openDialogAtom)
    const { setLaboratories } = useLaboratories()
    const router = useRouter()
    const selectLaboratory = useSetAtom(selectedLaboratoryIdAtom)
    // inputs
    const setName = useSetAtom(nameAtom)
    const setNameError = useSetAtom(errorNameAtom)
    const setOpenHour = useSetAtom(openHourAtom)
    const setOpenHourError = useSetAtom(errorOpenHourAtom)
    const setCloseHour = useSetAtom(closeHourAtom)
    const setCloseHourError = useSetAtom(errorCloseHourAtom)
    const setTypeError = useSetAtom(errorTypeAtom)

    const onAction = useCallback(
        ({
            name,
            close_hour,
            open_hour,
            type,
        }: {
            name: string
            close_hour: number
            open_hour: number
            type: LABORATORY_TYPE
        }) =>
            startTransition(async () => {
                const response = await createLaboratory({
                    name,
                    close_hour,
                    open_hour,
                    type,
                })
                if (response.status === 'success') {
                    setLaboratories(labs => [...labs, response.laboratory])
                    openDialog(null)
                    setName('')
                    setNameError('')
                    setOpenHour('08:00')
                    setCloseHour('20:00')
                } else {
                    if (response.type === 'unauthorized') {
                        router.replace(app.auth.login())
                    } else if (response.type === 'permission') {
                        setMessage('No tienes permiso para crear laboratorios')
                    } else if (response.type === 'invalid-input') {
                        if (response.input === 'name') {
                            setNameError(response.message)
                        } else if (response.input === 'open_hour') {
                            setOpenHourError(response.message)
                        } else if (response.input === 'close_hour') {
                            setCloseHourError(response.message)
                        } else if (response.input === 'type') {
                            setTypeError(response.message)
                        }
                    } else if (response.type === 'already-exists') {
                        setNameError('El laboratorio ya existe')
                    } else if (response.type === 'unexpected') {
                        setMessage('Ha ocurrido un error, intente más tarde')
                    } else if (response.type === 'already-archived') {
                        selectLaboratory(response.id)
                        openDialog('UNARCHIVE_OR_DELETE')
                    }
                }
            }),
        [
            openDialog,
            router,
            setCloseHour,
            setCloseHourError,
            setLaboratories,
            setName,
            setNameError,
            setOpenHour,
            setOpenHourError,
            setTypeError,
            selectLaboratory,
        ],
    )

    return (
        <Dialog
            open={dialogOpened === 'CREATE'}
            onOpenChange={open => {
                if (!open) {
                    openDialog(null)
                    setName('')
                    setOpenHour('08:00')
                    setCloseHour('20:00')
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Laboratorio</DialogTitle>
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
                    {message && <MessageError>{message}</MessageError>}
                    <NameInput />
                    <OpenHourInput />
                    <CloseHourInput />
                    <LaboratoryTypeSelect />

                    <Button type='submit' disabled={inTransition}>
                        <SaveIcon className='mr-2 h-5 w-5' />
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
