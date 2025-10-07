'use client'

import { useAtom, useAtomValue } from 'jotai'
import { BanIcon, Trash2Icon } from 'lucide-react'
import { useCallback, useState, useTransition } from 'react'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import {
    openDialogAtom,
    selectedLaboratoryAtom,
} from '@/global/laboratories.globals'
import { useLaboratories } from '@/hooks/laboratories.hoohs'
import { deleteLaboratory } from '@/actions/laboratories.actions'
import { useRouter } from 'next/navigation'

export function DeleteDialog() {
    const [open, setOpen] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedLaboratoryAtom)
    const [message, setMessage] = useState('')
    const { setLaboratories, refetchLaboratories } = useLaboratories()
    const router = useRouter()

    const onAction = useCallback(
        async (id: string) => {
            startTransition(async () => {
                const response = await deleteLaboratory(id)
                if (response.status === 'success') {
                    setLaboratories(labs => labs.filter(lab => lab.id !== id))
                    setOpen(null)
                } else {
                    if (response.type === 'not-found') {
                        await refetchLaboratories()
                        setOpen(null)
                    } else if (response.type === 'unexpected') {
                        setMessage('Ha ocurrido un error, intente más tarde')
                    } else if (response.type === 'permission') {
                        setMessage(
                            'No tienes permiso para eliminar este laboratorio',
                        )
                    } else if (response.type === 'unauthorized') {
                        router.replace('/login')
                    }
                }
            })
        },
        [setLaboratories, setOpen, refetchLaboratories, router],
    )

    if (!entity) return null

    return (
        <Dialog
            open={open === 'DELETE'}
            onOpenChange={state => {
                if (!state) setOpen(null)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar Laboratorio</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de eliminar <strong>{entity.name}</strong>?
                        <strong>Esta acción es irreversible</strong>
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        startTransition(async () => {
                            const id = data.get('id') as string
                            onAction(id)
                        })
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && <MessageError>{message}</MessageError>}
                    <input type='hidden' value={entity.id} name='id' />
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                setOpen(null)
                            }}
                        >
                            <BanIcon className='mr-2 h-5 w-5' />
                            Cancelar
                        </Button>
                        <Button
                            type='submit'
                            variant={'destructive'}
                            disabled={inTransition}
                        >
                            <Trash2Icon className='mr-2 h-5 w-5' />
                            Eliminar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
