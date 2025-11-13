'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
    CalendarRangeIcon,
    HashIcon,
    IdCardIcon,
    Save,
    UserIcon,
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
import { editStudent } from '@/actions/students.actions'
import { Button } from '@/components/Button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog'
import { MessageError } from '@/components/Error'
import { RetornableCompletInput } from '@/components/Inputs'
import { RetornableCompletSelect } from '@/components/Select'
import { openDialogAtom, selectedStudentAtom } from '@/global/students.globals'
import { useCareers } from '@/hooks/careers.hooks'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { STATUS } from '@/prisma/generated/enums'
import { SearchStudentsContext } from '@/contexts/students.context'

function EditDialog() {
    const { refreshStudents } = use(SearchStudentsContext)
    const [open, openDialog] = useAtom(openDialogAtom)
    const [inTransition, startTransition] = useTransition()
    const old = useAtomValue(selectedStudentAtom)
    const [message, setMessage] = useState('')
    const { careers, activeCareers } = useCareers()
    const router = useRouter()

    const originalCareer = useMemo(() => {
        if (!old) return null
        const career = careers.find(c => c.id === old.career_id)
        if (!career) return { label: 'Deleted Career', value: old.career_id }
        if (career.status === STATUS.ARCHIVED)
            return { label: `(Archived) ${career.name}`, value: career.id }
        return { label: career.name, value: career.id }
    }, [old, careers])

    const careerOptions = useMemo(() => {
        return activeCareers.map(c => ({
            label: c.name,
            value: c.id,
        }))
    }, [activeCareers])

    const onAction = useCallback(
        (formData: FormData) => {
            if (!old) return
            const career_id = formData.get('career_id') as string
            const firstname = formData.get('firstname') as string
            const group = Number(formData.get('group'))
            const lastname = formData.get('lastname') as string
            const nc = formData.get('nc') as string
            const semester = Number(formData.get('semester'))

            startTransition(async () => {
                const res = await editStudent({
                    career_id,
                    firstname,
                    group,
                    lastname,
                    nc,
                    semester,
                })
                if (res.status === 'success') {
                    refreshStudents()
                    openDialog(null)
                    return
                } else if (res.type === 'not-found') {
                    refreshStudents()
                    openDialog(null)
                } else if (res.type === 'permission') {
                    setMessage('No tienes permiso para editar esta máquina')
                } else if (res.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (res.type === 'unexpected') {
                    setMessage(
                        'Ha ocurrido un error inesperado, intente mas tarde',
                    )
                }
            })
        },
        [old, openDialog, router, refreshStudents],
    )

    if (!old) return null

    return (
        <Dialog
            open={open === 'EDIT'}
            onOpenChange={state => openDialog(state ? 'EDIT' : null)}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Estudiante</DialogTitle>
                    <DialogDescription>
                        Edita el estudiante {old.firstname} {old.lastname}
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={onAction}
                    className='flex w-full max-w-md flex-col justify-center gap-6'
                >
                    <Activity mode={message ? 'visible' : 'hidden'}>
                        <MessageError>{message}</MessageError>
                    </Activity>
                    <RetornableCompletInput
                        originalValue={old.nc}
                        required
                        label='Numero de Control'
                        type='text'
                        name='nc'
                        icon={HashIcon}
                    />
                    <RetornableCompletInput
                        originalValue={old.firstname}
                        required
                        label='Nombres'
                        type='text'
                        name='firstname'
                        icon={UserIcon}
                    />
                    <RetornableCompletInput
                        originalValue={old.lastname}
                        required
                        label='Apellidos'
                        type='text'
                        name='lastname'
                        icon={IdCardIcon}
                    />
                    <RetornableCompletInput
                        originalValue={old.semester}
                        required
                        label='Semestre'
                        type='number'
                        name='semester'
                        icon={CalendarRangeIcon}
                    />
                    <RetornableCompletSelect
                        originalValue={originalCareer}
                        options={careerOptions}
                        required
                        label='Carrera'
                        name='career_id'
                        icon={CalendarRangeIcon}
                    />
                    <Button type='submit' disabled={inTransition}>
                        <Save className='mr-2 h-5 w-5' />
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function SuspenseEditDialog() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditDialog />
        </Suspense>
    )
}

export { SuspenseEditDialog as EditDialog }
