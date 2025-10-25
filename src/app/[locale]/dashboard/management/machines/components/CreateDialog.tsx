'use client'

import { useAtom, useSetAtom } from 'jotai'
import { UserIcon, Save } from 'lucide-react'
import { useCallback, useState, useTransition } from 'react'
import { createMachine } from '@/actions/machines.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { CompletInput, CompletTextarea } from '@/components/Inputs'
import { CompletSelect } from '@/components/Select'
import {
    openDialogAtom,
    selectedMachineIdAtom,
} from '@/global/machines.globals'
import { useLaboratories } from '@/hooks/laboratories.hoohs'
import { MACHINE_STATUS } from '@/prisma/generated/enums'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { useMachines } from '@/hooks/machines.hooks'

export function CreateSubjectDialog() {
    const [dialogOpened, openDialog] = useAtom(openDialogAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const setEntityToEdit = useSetAtom(selectedMachineIdAtom)
    const { laboratories } = useLaboratories()
    const router = useRouter()
    const [serieError, setSerieError] = useState('')
    const { setMachines } = useMachines()

    const onAction = useCallback(
        (formData: FormData) => {
            const description = formData.get('description') as string
            const number = Number(formData.get('number'))
            const processor = formData.get('processor') as string
            const ram = formData.get('ram') as string
            const storage = formData.get('storage') as string
            const laboratory_id = formData.get('laboratory_id') as string
            const serie = formData.get('serie') as string
            const status = formData.get('status') as MACHINE_STATUS

            startTransition(async () => {
                const res = await createMachine({
                    description,
                    number,
                    processor,
                    ram,
                    status,
                    storage,
                    laboratory_id,
                    serie,
                })
                if (res.status === 'success') {
                    setMachines(prev => [...prev, res.machine])
                    openDialog(null)
                    return
                }
                if (res.type === 'already-archived') {
                    setEntityToEdit(res.id)
                    openDialog('UNARCHIVE_OR_DELETE')
                } else if (res.type === 'permission') {
                    setMessage(res.message)
                } else if (res.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (res.type === 'invalid-input') {
                    if (res.field === 'serie') {
                        setSerieError('Esta serie ya existe')
                    }
                } else if (res.type === 'unexpected') {
                    setMessage(
                        'Ha ocurrido un error inesperado, intente mas tarde',
                    )
                }
            })
        },
        [openDialog, router, setEntityToEdit, setMachines],
    )

    return (
        <Dialog
            open={dialogOpened === 'CREATE'}
            onOpenChange={state => openDialog(state ? 'CREATE' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear Máquina</DialogTitle>
                </DialogHeader>
                {/* <DialogDescription>
                    Edit the user&apos;s information
                </DialogDescription> */}
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && <MessageError>{message}</MessageError>}
                    <CompletInput
                        required
                        label='Numero'
                        type='number'
                        name='number'
                        icon={UserIcon}
                    />
                    <CompletInput
                        required
                        label='Procesador'
                        type='text'
                        name='processor'
                        icon={UserIcon}
                    />
                    <CompletInput
                        required
                        label='RAM'
                        type='text'
                        name='ram'
                        icon={UserIcon}
                    />
                    <CompletInput
                        required
                        label='Almacenamiento'
                        type='text'
                        name='storage'
                        icon={UserIcon}
                    />
                    <CompletInput
                        required
                        label='Serie'
                        type='text'
                        name='serie'
                        icon={UserIcon}
                        error={serieError}
                    />
                    <CompletTextarea
                        label='Descripcion'
                        name='description'
                        icon={UserIcon}
                    ></CompletTextarea>
                    <CompletSelect
                        label='Laboratorio Asignado'
                        name='laboratory_id'
                        options={laboratories.map(t => ({
                            label: t.name,
                            value: t.id,
                        }))}
                        icon={UserIcon}
                    />

                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Crear
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
