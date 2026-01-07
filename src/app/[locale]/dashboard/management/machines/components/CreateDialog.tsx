'use client'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Activity, use, useCallback, useState, useTransition } from 'react'
import { createMachine } from '@/actions/machines.actions'
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
import { MACHINE_STATUS } from '@/prisma/generated/enums'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchMachinesContext } from '@/contexts/machines.context'
import { CompletField } from '@/components/ui/complet-field'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import {
    AsyncCombobox,
    AsyncComboboxItem,
} from '@/components/ui/async-combobox'
import { searchLaboratories } from '@/actions/search.actions'
import {
    MonitorCheckIcon,
    HashIcon,
    UserIcon,
    FileTextIcon,
} from 'lucide-react'

const errorNumberAtom = atom('')
const errorProcessorAtom = atom('')
const errorRamAtom = atom('')
const errorStorageAtom = atom('')
const errorLaboratoryAtom = atom('')
const errorSerieAtom = atom('')
const errorDescriptionAtom = atom('')

export function CreateSubjectDialog() {
    const [open, openDialog] = useAtom(dialogAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const setEntityToEdit = useSetAtom(selectedIdAtom)
    const router = useRouter()
    const { refresh } = use(SearchMachinesContext)

    const setErrorNumber = useSetAtom(errorNumberAtom)
    const setErrorProcessor = useSetAtom(errorProcessorAtom)
    const setErrorRam = useSetAtom(errorRamAtom)
    const setErrorStorage = useSetAtom(errorStorageAtom)
    const setErrorLaboratory = useSetAtom(errorLaboratoryAtom)
    const setErrorSerie = useSetAtom(errorSerieAtom)
    const setErrorDescription = useSetAtom(errorDescriptionAtom)

    const onAction = useCallback(
        (data: FormData) => {
            const number = Number(data.get('number'))
            const processor = data.get('processor') as string
            const ram = data.get('ram') as string
            const storage = data.get('storage') as string
            const laboratory_id = data.get('laboratory_id') as string
            const serie = data.get('serie') as string
            const description = data.get('description') as string
            const status = MACHINE_STATUS.AVAILABLE

            startTransition(async () => {
                const res = await createMachine({
                    number,
                    processor,
                    ram,
                    storage,
                    laboratory_id,
                    serie,
                    description,
                    status,
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
                    setMessage('No tienes permiso para crear esta máquina')
                } else if (res.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (res.type === 'invalid-input') {
                    if (res.field === 'serie') {
                        setErrorSerie(res.message)
                    }
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
            setEntityToEdit,
            setErrorNumber,
            setErrorProcessor,
            setErrorRam,
            setErrorStorage,
            setErrorLaboratory,
            setErrorSerie,
            setErrorDescription,
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
                        <DialogTitle>Crear Máquina</DialogTitle>
                    </DialogHeader>

                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>

                    <div className='flex w-full gap-4'>
                        <NumberInput />
                        <ProcessorInput />
                    </div>
                    <div className='flex w-full gap-4'>
                        <RamInput />
                        <StorageInput />
                    </div>
                    <LaboratoryInput />
                    <SerieInput />
                    <DescriptionInput />

                    <DialogFooter>
                        <DialogClose
                            render={<Button variant='outline'>Cancel</Button>}
                        />
                        <Button type='submit' disabled={inTransition}>
                            Crear
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function NumberInput() {
    const error = useAtomValue(errorNumberAtom)
    return (
        <CompletField
            label='Número'
            name='number'
            icon={HashIcon}
            type='number'
            error={error}
            required
        />
    )
}

function ProcessorInput() {
    const error = useAtomValue(errorProcessorAtom)
    return (
        <CompletField
            label='Procesador'
            name='processor'
            icon={UserIcon}
            type='text'
            error={error}
            required
        />
    )
}

function RamInput() {
    const error = useAtomValue(errorRamAtom)
    return (
        <CompletField
            label='RAM'
            name='ram'
            icon={UserIcon}
            type='text'
            error={error}
            required
        />
    )
}

function StorageInput() {
    const error = useAtomValue(errorStorageAtom)
    return (
        <CompletField
            label='Almacenamiento'
            name='storage'
            icon={UserIcon}
            type='text'
            error={error}
            required
        />
    )
}

function LaboratoryInput() {
    const error = useAtomValue(errorLaboratoryAtom)
    const [value, setValue] = useState<AsyncComboboxItem | null>(null)

    return (
        <Field>
            <FieldLabel>Laboratorio</FieldLabel>
            <AsyncCombobox
                name='laboratory_id'
                placeholder='Seleccionar laboratorio'
                searchPlaceholder='Buscar laboratorio...'
                value={value}
                onChange={setValue}
                onSearch={async query => {
                    const res = await searchLaboratories({ query })
                    return res.laboratories.map(l => ({
                        value: l.id,
                        label: l.name,
                    }))
                }}
            />
            <FieldError errors={error ? [{ message: error }] : []} />
        </Field>
    )
}

function SerieInput() {
    const error = useAtomValue(errorSerieAtom)
    return (
        <CompletField
            label='Serie'
            name='serie'
            icon={UserIcon}
            type='text'
            error={error}
        />
    )
}

function DescriptionInput() {
    const error = useAtomValue(errorDescriptionAtom)
    return (
        <CompletField
            label='Descripción'
            name='description'
            icon={FileTextIcon}
            type='text'
            error={error}
        />
    )
}
