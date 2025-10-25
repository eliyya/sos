'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Ban, Trash2 } from 'lucide-react'
import { useCallback, useState, useTransition } from 'react'
import { deleteSubject } from '@/actions/subjects.actions'
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
import { useRouter } from 'next/router'
import { useSubjects } from '@/hooks/subjects.hooks'
import app from '@eliyya/type-routes'

export function DeleteDialog() {
    const [dialog, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const subject = useAtomValue(selectedSubjectAtom)
    const [message, setMessage] = useState('')
    const { setSubjects, refetchSubjects } = useSubjects()
    const router = useRouter()

    const onAction = useCallback(async () => {
        if (!subject) return
        startTransition(async () => {
            const res = await deleteSubject(subject.id)
            if (res.status === 'success') {
                openDialog(null)
                setSubjects(prev =>
                    prev.filter(subject => subject.id !== subject.id),
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
    }, [subject, openDialog, refetchSubjects, router, setSubjects])

    if (!subject) return null

    return (
        <Dialog
            open={dialog === 'DELETE'}
            onOpenChange={open => {
                openDialog(open ? 'DELETE' : null)
                if (!open) {
                    setMessage('')
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar Asignatura</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de eliminar la asignatura{' '}
                        <strong>{subject.name}</strong>?
                        <strong>Esta acción es irreversible</strong>
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
                            <Trash2 className='mr-2 h-5 w-5' />
                            Eliminar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
