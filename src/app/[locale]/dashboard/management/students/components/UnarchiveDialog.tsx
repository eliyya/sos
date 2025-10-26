'use client'

import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
    ArchiveRestore,
    Ban,
    CalendarRangeIcon,
    GraduationCapIcon,
    HashIcon,
    UserIcon,
    UsersIcon,
} from 'lucide-react'
import { Activity, useCallback, useMemo, useState, useTransition } from 'react'
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
import { openDialogAtom, selectedStudentAtom } from '@/global/students.globals'
import { useRouter } from 'next/navigation'
import { useStudents } from '@/hooks/students.hooks'
import { STATUS } from '@/prisma/generated/enums'
import app from '@eliyya/type-routes'
import { CompletInput } from '@/components/Inputs'
import { useCareers } from '@/hooks/careers.hooks'

export function UnarchiveDialog() {
    const [open, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entity = useAtomValue(selectedStudentAtom)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const { setStudents, refetchStudents } = useStudents()
    const { careers } = useCareers()

    const career = useMemo(() => {
        if (!entity) return ''
        const career = careers.find(career => career.id === entity.career_id)
        if (!career) return 'Deleted Career'
        if (career.status === STATUS.ARCHIVED)
            return `(Archived) ${career.alias}`
        return career.alias
    }, [entity, careers])

    const onAction = useCallback(() => {
        if (!entity) return
        startTransition(async () => {
            const res = await unarchiveStudent(entity.nc)
            if (res.status === 'success') {
                openDialog(null)
                setStudents(prev =>
                    prev.map(student =>
                        student.nc === entity.nc ?
                            { ...student, status: STATUS.ACTIVE }
                        :   student,
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
    }, [entity, openDialog, router])

    if (!entity) return null

    return (
        <Dialog
            open={open === 'UNARCHIVE'}
            onOpenChange={status => openDialog(status ? 'UNARCHIVE' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Desarchivar Estudiante</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de desarchivar al estudiante{' '}
                        {entity.firstname} {entity.lastname}?
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
