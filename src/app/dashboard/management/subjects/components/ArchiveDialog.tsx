'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Archive, Ban } from 'lucide-react'
import { useCallback, useState, useTransition } from 'react'
import { archiveSubject } from '@/actions/subjects.actions'
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
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

export function ArchiveDialog() {
    const [dialog, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedSubjectAtom)
    const [message, setMessage] = useState('')
    const { setSubjects, refetchSubjects } = useSubjects()
    const router = useRouter()

    const onAction = useCallback(async () => {
        if (!entity) return
        startTransition(async () => {
            const res = await archiveSubject(entity.id)
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
                router.replace(app.auth.login())
            } else if (res.type === 'unexpected') {
                setMessage('Ha ocurrido un error, intentalo más tarde')
            }
        })
    }, [entity, openDialog, refetchSubjects, router, setSubjects])

    if (!entity) return null

    return (
        <Dialog
            open={dialog === 'ARCHIVE'}
            onOpenChange={state => openDialog(state ? 'ARCHIVE' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Archivar Asignatura</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de archivar la asignatura{' '}
                        <strong>{entity.name}</strong>?
                        <strong>Esta acción es reversible</strong>
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    {message && <MessageError>{message}</MessageError>}
                    <div className='flex flex-row gap-2 *:flex-1'>
                        <Button
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
                            variant={'destructive'}
                            disabled={inTransition}
                        >
                            <Archive className='mr-2 h-5 w-5' />
                            Archivar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
