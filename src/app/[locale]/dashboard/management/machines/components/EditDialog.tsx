'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Save, User } from 'lucide-react'
import {
    Activity,
    Suspense,
    use,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
import { editMachine } from '@/actions/machines.actions'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { MessageError } from '@/components/Error'
import { RetornableCompletInput } from '@/components/Inputs'
import { RetornableCompletAsyncSelect } from '@/components/Select'
import {
    laboratoriesSelectOptionsAtom,
    dialogAtom,
    selectedIdAtom,
} from '@/global/management.globals'
import { MACHINE_STATUS } from '@/prisma/generated/enums'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchMachinesContext } from '@/contexts/machines.context'
import { searchLaboratories } from '@/actions/search.actions'

function EditDialog() {
    const [dialogOpened, openDialog] = useAtom(dialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entityId = useAtomValue(selectedIdAtom)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const { refresh, promise } = use(SearchMachinesContext)

    const { machines } = use(promise)

    const entity = useMemo(() => {
        return machines.find(m => m.id === entityId)
    }, [machines, entityId])

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
            if (!entityId) return
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
                    id: entityId,
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
                    refresh()
                    openDialog(null)
                    return
                } else if (res.type === 'not-found') {
                    refresh()
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
        [entityId, openDialog, refresh, router],
    )

    if (!entity) return null

    return (
        <Dialog
            open={dialogOpened === 'EDIT'}
            onOpenChange={state => openDialog(state ? 'EDIT' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Máquina</DialogTitle>
                    <DialogDescription>
                        Editar la máquina {entity.number}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <input type='hidden' value={entity.id} name='id' />
                    <RetornableCompletInput
                        originalValue={entity.number}
                        required
                        label='Numero'
                        type='number'
                        name='number'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={entity.processor}
                        required
                        label='Procesador'
                        type='text'
                        name='processor'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={entity.ram}
                        required
                        label='Ram'
                        type='text'
                        name='ram'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={entity.storage}
                        required
                        label='Almacenamiento'
                        type='text'
                        name='storage'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={entity.serie ?? ''}
                        required
                        label='Serie'
                        type='text'
                        name='serie'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletInput
                        originalValue={entity.description}
                        label='Descripcion'
                        name='description'
                        icon={User}
                    ></RetornableCompletInput>
                    <RetornableCompletAsyncSelect
                        isClearable
                        // TODO: fix this
                        originalValue={{
                            label: '',
                            value: entity.laboratory_id,
                        }}
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

function SuspenseEditDialog() {
    return (
        <Suspense>
            <EditDialog />
        </Suspense>
    )
}

export { SuspenseEditDialog as EditDialog }
