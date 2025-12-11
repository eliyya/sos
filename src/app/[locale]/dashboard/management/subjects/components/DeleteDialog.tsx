'use client'

import { useAtom, useAtomValue } from 'jotai'
import { Ban, ClockFadingIcon, SquarePenIcon, Trash2 } from 'lucide-react'
import {
    Activity,
    Suspense,
    use,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
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
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { CompletInput } from '@/components/Inputs'
import { SearchSubjectsContext } from '@/contexts/subjects.context'

function DeleteDialog() {
    const [dialog, openDialog] = useAtom(dialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entityId = useAtomValue(selectedIdAtom)
    const [message, setMessage] = useState('')
    const { refresh, promise: subjectsPromise } = use(SearchSubjectsContext)
    const router = useRouter()
    const { subjects } = use(subjectsPromise)

    const entity = useMemo(() => {
        return subjects?.find(subject => subject.id === entityId)
    }, [subjects, entityId])

    const onAction = useCallback(async () => {
        if (!entityId) return
        startTransition(async () => {
            const res = await deleteSubject(entityId)
            if (res.status === 'success') {
                openDialog(null)
                refresh()
                return
            }
            if (res.type === 'not-found') {
                openDialog(null)
                refresh()
            } else if (res.type === 'permission') {
                setMessage('No tienes permiso para archivar esta asignatura')
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                setMessage('Ha ocurrido un error, intentalo más tarde')
            }
        })
    }, [entityId, openDialog, refresh, router])

    if (!entity) return null

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
                        <strong>{entity.name}</strong>?
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
                    <CompletInput
                        disabled
                        value={entity.name}
                        label='Nombre'
                        icon={SquarePenIcon}
                    />
                    <div className='flex w-full gap-4'>
                        <CompletInput
                            disabled
                            value={entity.theory_hours}
                            label='Horas Teoricas'
                            icon={ClockFadingIcon}
                        />
                        <CompletInput
                            disabled
                            value={entity.practice_hours}
                            label='Horas Prácticas'
                            icon={ClockFadingIcon}
                        />
                    </div>
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

function SuspenseDeleteDialog() {
    return (
        <Suspense>
            <DeleteDialog />
        </Suspense>
    )
}

export { SuspenseDeleteDialog as DeleteDialog }
