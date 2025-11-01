'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
    Archive,
    Ban,
    CalendarRangeIcon,
    GraduationCapIcon,
    HashIcon,
    UserIcon,
    UsersIcon,
} from 'lucide-react'
import {
    Activity,
    use,
    useCallback,
    useMemo,
    useState,
    useTransition,
} from 'react'
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
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { CompletInput } from '@/components/Inputs'
import { useCareers } from '@/hooks/careers.hooks'
import { STATUS } from '@/prisma/generated/enums'
import { SearchStudentsContext } from '@/contexts/students.context'

export function ArchiveDialog() {
    const { refreshStudents } = use(SearchStudentsContext)
    const [open, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedStudentAtom)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const { careers } = useCareers()

    const career = useMemo(() => {
        if (!entity) return 'Deleted Career'
        const career = careers.find(career => career.id === entity.career_id)
        if (!career) return ''
        if (career.status === STATUS.ARCHIVED)
            return `(Archived) ${career.alias}`
        return career.alias
    }, [entity, careers])

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const res = await archiveStudent(entity.nc)
            if (res.status === 'success') {
                openDialog(null)
                refreshStudents()
                return
            }
            if (res.type === 'not-found') {
                refreshStudents()
                openDialog(null)
            } else if (res.type === 'permission') {
                setMessage(res.message)
            } else if (res.type === 'unauthorized') {
                router.replace(app.$locale.auth.login('es'))
            } else if (res.type === 'unexpected') {
                setMessage('Ha ocurrido un error inesperado, intente mas tarde')
            }
        })
    }, [entity, openDialog, router, refreshStudents])

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
                        value={career}
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
                            <Archive className='mr-2 h-5 w-5' />
                            Archivar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
