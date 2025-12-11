'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
    ArchiveRestoreIcon,
    BanIcon,
    CalendarRangeIcon,
    GraduationCapIcon,
    HashIcon,
    TrashIcon,
    UserIcon,
    UsersIcon,
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
import { unarchiveStudent } from '@/actions/students.actions'
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
import { SearchStudentsContext } from '@/contexts/students.context'

function UnarchiveOrDeleteDialog() {
    const { refresh, promise } = use(SearchStudentsContext)
    const [open, openDialog] = useAtom(dialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entityNc = useAtomValue(selectedIdAtom)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const { students } = use(promise)

    const entity = useMemo(() => {
        return students.find(student => student.nc === entityNc)
    }, [students, entityNc])

    const onAction = useCallback(() => {
        if (!entityNc) return
        startTransition(async () => {
            const res = await unarchiveStudent(entityNc)
            if (res.status === 'success') {
                openDialog(null)
                refresh()
                return
            }
            if (res.type === 'not-found') {
                refresh()
                openDialog(null)
            } else if (res.type === 'permission') {
                setMessage(res.message)
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                setMessage('Ha ocurrido un error inesperado, intente mas tarde')
            }
        })
    }, [entityNc, openDialog, router, refresh])

    if (!entity) return null

    return (
        <Dialog
            open={open === 'UNARCHIVE_OR_DELETE'}
            onOpenChange={state =>
                openDialog(state ? 'UNARCHIVE_OR_DELETE' : null)
            }
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Estudiante archivado</DialogTitle>
                    <DialogDescription>
                        El estudiante {entity.firstname} {entity.lastname} con
                        el numero de control {entity.nc} está archivado. ¿Qué
                        desea hacer con el estudiante?
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
                        value={entityNc}
                        label='Numero de Control'
                        icon={HashIcon}
                    />
                    <CompletInput
                        disabled
                        value={`${entity.firstname} ${entity.lastname}`}
                        label='Nombres'
                        icon={UserIcon}
                    />
                    <CompletInput
                        disabled
                        value={entity.semester}
                        label='Semestre'
                        icon={CalendarRangeIcon}
                    />
                    <CompletInput
                        disabled
                        value={entity.career.displayalias}
                        label='Carrera'
                        icon={GraduationCapIcon}
                    />
                    <CompletInput
                        disabled
                        value={entity.group}
                        label='Grupo'
                        icon={UsersIcon}
                    />
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

function SuspenseUnarchiveOrDeleteDialog() {
    return (
        <Suspense>
            <UnarchiveOrDeleteDialog />
        </Suspense>
    )
}

export { SuspenseUnarchiveOrDeleteDialog as UnarchiveOrDeleteDialog }
