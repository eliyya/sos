'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
    ArchiveRestoreIcon,
    BanIcon,
    ClockFadingIcon,
    SquarePenIcon,
} from 'lucide-react'
import {
    Activity,
    Suspense,
    use,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
import { unarchiveSubject } from '@/actions/subjects.actions'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { dialogAtom, selectedIdAtom } from '@/global/management.globals'
import app from '@eliyya/type-routes'
import { useRouter } from 'next/navigation'
import { CompletInput } from '@/components/Inputs'
import { SearchSubjectsContext } from '@/contexts/subjects.context'

function UnarchiveDialog() {
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
            const res = await unarchiveSubject(entityId)
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
                            variant={'secondary'}
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

function SuspenseUnarchiveDialog() {
    return (
        <Suspense>
            <UnarchiveDialog />
        </Suspense>
    )
}

export { SuspenseUnarchiveDialog as UnarchiveDialog }
