'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
    Ban,
    CalendarRangeIcon,
    GraduationCapIcon,
    HashIcon,
    Trash2,
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
import {
    openDialogAtom,
    selectedStudentNCAtom,
} from '@/global/students.globals'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { CompletInput } from '@/components/Inputs'
import { SearchStudentsContext } from '@/contexts/students.context'

function DeleteDialog() {
    const { refreshStudents, studentsPromise } = use(SearchStudentsContext)
    const [open, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entityNc = useAtomValue(selectedStudentNCAtom)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const { students } = use(studentsPromise)

    const entity = useMemo(() => {
        return students.find(student => student.nc === entityNc)
    }, [students, entityNc])

    const onAction = useCallback(() => {
        if (!entityNc) return
        startTransition(async () => {
            const res = await deleteStudent(entityNc)
            if (res.status === 'success') {
                refreshStudents()
                openDialog(null)
                return
            }
            if (res.type === 'not-found') {
                refreshStudents()
                openDialog(null)
            } else if (res.type === 'permission') {
                setMessage('No tienes permiso para eliminar esta estudiante')
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                setMessage('Ha ocurrido un error inesperado, intente mas tarde')
            }
        })
    }, [entityNc, openDialog, router, refreshStudents])

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
                    <CompletInput
                        disabled
                        value={entity.nc}
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
        <Suspense fallback={<div>Loading...</div>}>
            <DeleteDialog />
        </Suspense>
    )
}

export { SuspenseDeleteDialog as DeleteDialog }
