'use client'

import { useAtom, useAtomValue } from 'jotai'
import {
    CalendarRangeIcon,
    GraduationCapIcon,
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
import { RetornableCompletAsyncSelect } from '@/components/Select'
import {
    careersSelectOptionsAtom,
    dialogAtom,
    selectedIdAtom,
} from '@/global/management.globals'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { SearchStudentsContext } from '@/contexts/students.context'
import { useTranslations } from 'next-intl'
import { searchStudents } from '@/actions/search.actions'

function EditDialog() {
    const { refresh, promise } = use(SearchStudentsContext)
    const [open, openDialog] = useAtom(dialogAtom)
    const [inTransition, startTransition] = useTransition()
    const entityNc = useAtomValue(selectedIdAtom)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const { students } = use(promise)

    const old = useMemo(() => {
        return students.find(student => student.nc === entityNc)
    }, [students, entityNc])

    const onAction = useCallback(
        (formData: FormData) => {
            if (!entityNc) return
            const career_id = formData.get('career_id') as string
            const firstname = formData.get('firstname') as string
            const group = Number(formData.get('group'))
            const lastname = formData.get('lastname') as string
            const semester = Number(formData.get('semester'))

            startTransition(async () => {
                const res = await editStudent({
                    career_id,
                    firstname,
                    group,
                    lastname,
                    nc: entityNc,
                    semester,
                })
                if (res.status === 'success') {
                    refresh()
                    openDialog(null)
                    return
                } else if (res.type === 'not-found') {
                    refresh()
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
        [entityNc, openDialog, router, refresh],
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
                    <CareerSelect />
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

function CareerSelect() {
    const t = useTranslations('classes')
    const classId = useAtomValue(selectedIdAtom)
    const { promise } = use(SearchStudentsContext)
    const { students } = use(promise)
    const [careersSelectOptions, setCareersSelectOptions] = useAtom(
        careersSelectOptionsAtom,
    )
    const originalCareer = useMemo(() => {
        const student = students.find(s => s.nc === classId)
        if (!student) return null
        return {
            label: student.career.displayname,
            value: student.career_id,
        }
    }, [students, classId])
    const loadOptions = useCallback(
        (
            inputValue: string,
            callback: (options: { label: string; value: string }[]) => void,
        ) => {
            searchStudents({
                query: inputValue,
            }).then(res => {
                const options = res.students.map(s => ({
                    label: s.career.displayalias,
                    value: s.career_id,
                }))
                setCareersSelectOptions(options)
                callback(options)
            })
        },
        [setCareersSelectOptions],
    )
    return (
        <RetornableCompletAsyncSelect
            originalValue={originalCareer}
            label={t('career')}
            name='career_id'
            loadOptions={loadOptions}
            defaultOptions={careersSelectOptions}
            icon={GraduationCapIcon}
        />
    )
}
