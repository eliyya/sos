'use client'

import { useAtom, useAtomValue } from 'jotai'
import { ArchiveRestore, Ban } from 'lucide-react'
import { Activity, useCallback, useState, useTransition } from 'react'
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

export function UnarchiveDialog() {
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
            open={dialog === 'UNARCHIVE'}
            onOpenChange={open => openDialog(open ? 'UNARCHIVE' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Desarchivar Asignatura</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de desarchivar la asignatura {entity.name}?
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
                            variant={'secondary'}
                            disabled={inTransition}
                            onClick={e => {
                                e.preventDefault()
                                openDialog(null)
                            }}
                        >
                            <Ban className='mr-2 h-5 w-5' />
                            Cancelar
                        </Button>
                        <Button
                            type='submit'
                            variant={'default'}
                            disabled={inTransition}
                        >
                            <ArchiveRestore className='mr-2 h-5 w-5' />
                            Desarchivar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
