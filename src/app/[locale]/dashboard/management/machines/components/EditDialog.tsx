'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Save, User } from 'lucide-react'
import { Activity, useCallback, useMemo, useState, useTransition } from 'react'
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
import { RetornableCompletSelect } from '@/components/Select'
import { openDialogAtom, selectedMachineAtom } from '@/global/machines.globals'
import { useLaboratories } from '@/hooks/laboratories.hoohs'
import { MACHINE_STATUS, STATUS } from '@/prisma/generated/enums'
import { useMachines } from '@/hooks/machines.hooks'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

export function EditDialog() {
    const [dialogOpened, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(selectedMachineAtom)
    const [message, setMessage] = useState('')
    const { laboratories, activeLaboratories } = useLaboratories()
    const router = useRouter()
    const { setMachines, refetchMachines } = useMachines()
    const laboratoriesOptions = useMemo(() => {
        return activeLaboratories.map(laboratory => ({
            value: laboratory.id,
            label: laboratory.name,
        }))
    }, [activeLaboratories])
    const originalLaboratory = useMemo(() => {
        if (!old) return null
        const lab = laboratories.find(
            laboratory => laboratory.id === old?.laboratory_id,
        )
        if (!lab)
            return { value: old.laboratory_id, label: 'Laboratorio eliminado' }
        if (lab.status === STATUS.ARCHIVED)
            return { value: lab.id, label: `(Archivado) ${lab.name}` }
        return { value: lab.id, label: lab.name }
    }, [laboratories, old])

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
                    setMachines(prev =>
                        prev.map(machine =>
                            machine.id === old.id ? res.machine : machine,
                        ),
                    )
                    openDialog(null)
                    return
                } else if (res.type === 'not-found') {
                    refetchMachines()
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
        [old, openDialog, router, setMachines, refetchMachines],
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
                    <RetornableCompletSelect
                        isClearable
                        originalValue={originalLaboratory}
                        label='Laboratorio Asignado'
                        options={laboratoriesOptions}
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
