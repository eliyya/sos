'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArchiveRestoreIcon, BanIcon, TrashIcon } from 'lucide-react'
import { useCallback, useState, useTransition } from 'react'
import { unarchiveSubject } from '@/actions/subjects.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { openDialogAtom, selectedSubjectAtom } from '@/global/subjects.globals'
import { useSubjects } from '@/hooks/subjects.hooks'
import app from '@eliyya/type-routes'
import { useRouter } from 'next/navigation'

export function UnarchiveOrDeleteDialog() {
    const [dialog, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedSubjectAtom)
    const [message, setMessage] = useState('')
    const { setSubjects, refetchSubjects } = useSubjects()
    const router = useRouter()

    const onAction = useCallback(async () => {
        if (!entity) return
        startTransition(async () => {
            const res = await unarchiveSubject(entity.id)
            if (res.status === 'success') {
                openDialog(null)
                setSubjects(prev =>
                    prev.map(subject =>
                        subject.id !== entity.id ? subject : res.subject,
                    ),
                )
                return
            }
            if (res.type === 'not-found') {
                openDialog(null)
                refetchSubjects()
            } else if (res.type === 'permission') {
                setMessage('No tienes permiso para archivar esta asignatura')
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                setMessage('Ha ocurrido un error, intentalo más tarde')
            }
        })
    }, [entity, openDialog, refetchSubjects, router, setSubjects])

    if (!entity) return null

    return (
        <Dialog
            open={dialog === 'UNARCHIVE_OR_DELETE'}
            onOpenChange={open =>
                openDialog(open ? 'UNARCHIVE_OR_DELETE' : null)
            }
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Asignatura archivada</DialogTitle>
                    <DialogDescription>
                        La asignatura {entity.name} está archivada. ¿Qué desea
                        hacer? con <strong>{entity.name}</strong>?
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
                            type='button'
                            variant='secondary'
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                openDialog(null)
                            }}
                        >
                            <BanIcon className='mr-2 h-5 w-5' />
                            Cancelar
                        </Button>
                        <Button
                            type='submit'
                            variant='default'
                            disabled={inTransition}
                        >
                            <ArchiveRestoreIcon className='mr-2 h-5 w-5' />
                            Desarchivar
                        </Button>
                        <Button
                            type='button'
                            variant='destructive'
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                openDialog('DELETE')
                            }}
                        >
                            <TrashIcon className='mr-2 h-5 w-5' />
                            Eliminar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
