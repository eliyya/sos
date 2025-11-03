'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Save, User } from 'lucide-react'
import { Activity, use, useCallback, useState, useTransition } from 'react'
import { editMachine } from '@/actions/machines.actions'
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
import { RetornableCompletAsyncSelect } from '@/components/Select'
import {
    laboratoriesSelectOptionsAtom,
    openDialogAtom,
    selectedMachineAtom,
} from '@/global/machines.globals'
import { MACHINE_STATUS } from '@/prisma/generated/enums'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchMachinesContext } from '@/contexts/machines.context'
import { searchLaboratories } from '@/actions/laboratories.actions'

export function EditDialog() {
    const [dialogOpened, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(selectedMachineAtom)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const { refreshMachines } = use(SearchMachinesContext)
    const [defaultlaboratoriesOptions, setLaboratoriesSelectOptions] = useAtom(
        laboratoriesSelectOptionsAtom,
    )

    const loadOptions = useCallback(
        (
            inputValue: string,
            callback: (options: { label: string; value: string }[]) => void,
        ) => {
            searchLaboratories({
                query: inputValue,
            }).then(res => {
                const options = res.laboratories.map(laboratory => ({
                    label: laboratory.name,
                    value: laboratory.id,
                }))
                setLaboratoriesSelectOptions(options)
                callback(options)
            })
        },
        [setLaboratoriesSelectOptions],
    )

    const onAction = useCallback(
        (formData: FormData) => {
            if (!old) return
            const description = formData.get('description') as string
            const laboratory_id = formData.get('laboratory_id') as string
            const number = Number(formData.get('number'))
            const processor = formData.get('processor') as string
            const ram = formData.get('ram') as string
            const serie = formData.get('serie') as string
            const status = formData.get('status') as MACHINE_STATUS
            const storage = formData.get('storage') as string

            startTransition(async () => {
                const res = await editMachine({
                    id: old.id,
                    description,
                    laboratory_id,
                    number,
                    processor,
                    ram,
                    serie,
                    status,
                    storage,
                })
                if (res.status === 'success') {
                    refreshMachines()
                    openDialog(null)
                    return
                } else if (res.type === 'not-found') {
                    refreshMachines()
                    openDialog(null)
                } else if (res.type === 'permission') {
                    setMessage('No tienes permiso para editar esta máquina')
                } else if (res.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (res.type === 'invalid-input') {
                    if (res.field === 'serie') {
                        setMessage('La serie debe ser unico')
                    }
                } else if (res.type === 'unexpected') {
                    setMessage(
                        'Ha ocurrido un error inesperado, intente mas tarde',
                    )
                }
            })
        },
        [old, openDialog, refreshMachines, router],
    )

    if (!old) return null

    return (
        <Dialog
            open={dialogOpened === 'EDIT'}
            onOpenChange={state => openDialog(state ? 'EDIT' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Máquina</DialogTitle>
                    <DialogDescription>
                        Editar la máquina {old.number}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <input type='hidden' value={old.id} name='id' />
                    <RetornableCompletInput
                        originalValue={old.number}
                        required
                        label='Numero'
                        type='number'
                        name='number'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={old.processor}
                        required
                        label='Procesador'
                        type='text'
                        name='processor'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={old.ram}
                        required
                        label='Ram'
                        type='text'
                        name='ram'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={old.storage}
                        required
                        label='Almacenamiento'
                        type='text'
                        name='storage'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={old.serie ?? ''}
                        required
                        label='Serie'
                        type='text'
                        name='serie'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={old.description}
                        label='Descripcion'
                        name='description'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletAsyncSelect
                        isClearable
                        // TODO: fix this
                        originalValue={{ label: '', value: old.laboratory_id }}
                        label='Laboratorio Asignado'
                        loadOptions={loadOptions}
                        defaultOptions={defaultlaboratoriesOptions}
                        name='laboratory_id'
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
