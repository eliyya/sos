'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Archive, Ban } from 'lucide-react'
import { Activity, useCallback, useState, useTransition } from 'react'
import { archiveStudent } from '@/actions/students.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { openDialogAtom, selectedStudentAtom } from '@/global/students.globals'
import { useStudents } from '@/hooks/students.hooks'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

export function ArchiveDialog() {
    const [open, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedStudentAtom)
    const [message, setMessage] = useState('')
    const { setStudents, refetchStudents } = useStudents()
    const router = useRouter()

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const res = await archiveStudent(entity.nc)
            if (res.status === 'success') {
                openDialog(null)
                setStudents(prev =>
                    prev.map(student =>
                        student.nc === entity.nc ? res.student : student,
                    ),
                )
                return
            }
            if (res.type === 'not-found') {
                refetchStudents()
                openDialog(null)
            } else if (res.type === 'permission') {
                setMessage(res.message)
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                setMessage('Ha ocurrido un error inesperado, intente mas tarde')
            }
        })
    }, [entity, openDialog, router, setStudents, refetchStudents])

    if (!entity) return null

    return (
        <Dialog
            open={open === 'ARCHIVE'}
            onOpenChange={status => {
                if (!status) {
                    openDialog(null)
                    setMessage('')
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Archivar Estudiante</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de archivar al estudiante{' '}
                        {entity.firstname} {entity.lastname}?{' '}
                        <strong>Esta acción es reversible</strong>
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
