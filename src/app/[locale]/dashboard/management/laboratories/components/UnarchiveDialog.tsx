'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArchiveRestoreIcon, BanIcon } from 'lucide-react'
import { Activity, useCallback, useState, useTransition } from 'react'
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
import { unarchiveLaboratory } from '@/actions/laboratories.actions'
import { useRouter } from 'next/navigation'

export function UnarchiveDialog() {
    const [open, setOpen] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedLaboratoryAtom)
    const [message, setMessage] = useState('')
    const { setLaboratories, refetchLaboratories } = useLaboratories()
    const router = useRouter()

    const onAction = useCallback(
        async (id: string) => {
            startTransition(async () => {
                const response = await unarchiveLaboratory(id)
                if (response.status === 'success') {
                    setLaboratories(labs =>
                        labs.map(lab =>
                            lab.id !== id ? lab : response.laboratory,
                        ),
                    )
                    setOpen(null)
                } else {
                    if (response.type === 'not-found') {
                        await refetchLaboratories()
                        setOpen(null)
                    } else if (response.type === 'unexpected') {
                        setMessage('Ha ocurrido un error, intente más tarde')
                    } else if (response.type === 'permission') {
                        setMessage(
                            'No tienes permiso para archivar este laboratorio',
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
            open={open === 'UNARCHIVE'}
            onOpenChange={state => {
                if (!state) setOpen(null)
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Desarchivar Laboratorio</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de desarchivar {entity.name}?
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={data => {
                        const id = data.get('id') as string
                        onAction(id)
                    }}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <input type='hidden' value={entity.id} name='id' />
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            variant={'secondary'}
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
                            variant={'default'}
                            disabled={inTransition}
                        >
                            <ArchiveRestoreIcon className='mr-2 h-5 w-5' />
                            Desarchivar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
