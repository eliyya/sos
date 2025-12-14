'use client'

import { LABORATORY_TYPE } from '@/prisma/generated/browser'
import { atom, useAtom, useSetAtom } from 'jotai'
import {
    Clock8Icon,
    MicroscopeIcon,
    SaveIcon,
    SquarePenIcon,
} from 'lucide-react'
import { Activity, use, useCallback, useState, useTransition } from 'react'
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
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { createLaboratory } from '@/actions/laboratories.actions'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { timeToMinutes } from '@/lib/utils'
import { SearchLaboratoriesContext } from '@/contexts/laboratories.context'

const nameAtom = atom('')
const errorNameAtom = atom('')
const openHourAtom = atom('08:00')
const errorOpenHourAtom = atom('')
const closeHourAtom = atom('18:00')
const errorCloseHourAtom = atom('')
const defaultTypeAtom: {
    value: LABORATORY_TYPE
    label: string
} = {
    value: LABORATORY_TYPE.LABORATORY,
    label: 'Laboratorio',
}
const typeAtom = atom(defaultTypeAtom)
const errorTypeAtom = atom('')

export function CreateLaboratoryDialog() {
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const [dialogOpened, openDialog] = useAtom(dialogAtom)
    const { refresh } = use(SearchLaboratoriesContext)
    const router = useRouter()
    const selectLaboratory = useSetAtom(selectedIdAtom)
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
                    refresh()
                    openDialog(null)
                    setName('')
                    setNameError('')
                    setOpenHour('08:00')
                    setCloseHour('20:00')
                } else {
                    if (response.type === 'unauthorized') {
                        router.replace(app.$locale.auth.login('es'))
                    } else if (response.type === 'permission') {
                        setMessage('No tienes permiso para crear laboratorios')
                    } else if (response.type === 'invalid-input') {
                        if (response.field === 'name') {
                            setNameError(response.message)
                        } else if (response.field === 'open_hour') {
                            setOpenHourError(response.message)
                        } else if (response.field === 'close_hour') {
                            setCloseHourError(response.message)
                        } else if (response.field === 'type') {
                            setTypeError(response.message)
                        }
                    } else if (response.type === 'already-exists') {
                        setNameError('El laboratorio ya existe')
                    } else if (response.type === 'unexpected') {
                        setMessage('Ha ocurrido un error, intente más tarde')
                        console.log(response)
                    } else if (response.type === 'already-archived') {
                        selectLaboratory(response.id)
                        openDialog('UNARCHIVE_OR_DELETE')
                    }
                }
            }),
        [
            refresh,
            openDialog,
            setName,
            setNameError,
            setOpenHour,
            setCloseHour,
            router,
            setOpenHourError,
            setCloseHourError,
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
                        const close_hour = timeToMinutes(
                            data.get('close_hour') as string,
                        )
                        const open_hour = timeToMinutes(
                            data.get('open_hour') as string,
                        )
                        const type = data.get('type') as LABORATORY_TYPE
                        onAction({
                            name,
                            close_hour,
                            open_hour,
                            type,
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <NameInput />
                    <div className='flex gap-6'>
                        <OpenHourInput />
                        <CloseHourInput />
                    </div>
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
