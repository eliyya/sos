'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Ban, Trash2 } from 'lucide-react'
import { Activity, useCallback, useState, useTransition } from 'react'
import { deleteStudent } from '@/actions/students.actions'
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
import { useRouter } from 'next/navigation'
import { useStudents } from '@/hooks/students.hooks'
import app from '@eliyya/type-routes'

export function DeleteDialog() {
    const [open, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedStudentAtom)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const { setStudents, refetchStudents } = useStudents()

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const res = await deleteStudent(entity.nc)
            if (res.status === 'success') {
                setStudents(prev =>
                    prev.filter(student => student.nc !== entity.nc),
                )
                openDialog(null)
                return
            }
            if (res.type === 'not-found') {
                refetchStudents()
                openDialog(null)
            } else if (res.type === 'permission') {
                setMessage('No tienes permiso para eliminar esta estudiante')
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
            open={open === 'DELETE'}
            onOpenChange={state => openDialog(state ? 'DELETE' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar Estudiante</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de eliminar el estudiante{' '}
                        {entity.firstname} {entity.lastname}?
                        <strong>Esta acción es irreversible</strong>
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
                            <Trash2 className='mr-2 h-5 w-5' />
                            Eliminar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
