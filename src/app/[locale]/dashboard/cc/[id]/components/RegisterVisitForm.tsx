'use client'

import { useSetAtom } from 'jotai'
import { SquarePenIcon } from 'lucide-react'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { registerVisitAction } from '@/actions/cc'
import { Button } from '@/components/Button'
import { CompletInput } from '@/components/Inputs'
import { CompletSelect } from '@/components/Select'
import LabeledSwitch from '@/components/Switch'
import { errorAtom, updateTableAtom } from '@/global/cc'
import { useTranslations } from 'next-intl'
import { getStudent } from '@/actions/students.actions'
import { useCareers } from '@/hooks/careers.hooks'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'

interface RegisterVisitFormProps {
    laboratory_id: string
}
export function RegisterVisitForm(props: RegisterVisitFormProps) {
    const [inTransition, startTransition] = useTransition()
    const [modified, setModified] = useState(true)
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [nc, setNc] = useState('')
    const [semester, setSemester] = useState('')
    const [career_id, setCareerId] = useState('')
    const setError = useSetAtom(errorAtom)
    const refreshTable = useSetAtom(updateTableAtom)
    const t = useTranslations('cc')
    const { careers } = useCareers()
    const router = useRouter()

    const onAction = useCallback(
        (formData: FormData) => {
            const student_nc = formData.get('student_nc') as string
            const laboratory_id = formData.get('laboratory_id') as string
            const career_id = formData.get('career_id') as string
            const firstname = formData.get('firstname') as string
            const lastname = formData.get('lastname') as string
            const group = parseInt(formData.get('group') as string)
            const semester = parseInt(formData.get('semester') as string)
            startTransition(async () => {
                const res = await registerVisitAction({
                    student_nc,
                    laboratory_id,
                    career_id,
                    firstname,
                    group,
                    lastname,
                    semester,
                })
                if (res.status === 'success') {
                    refreshTable(Symbol())
                    setNc('')
                    setName('')
                    setLastname('')
                    setSemester('')
                    setModified(true)
                    return
                }
                if (res.type === 'unauthorized') {
                    router.replace(app.$locale.auth.login('es'))
                } else if (res.type === 'permission') {
                    setError('No tienes permiso para registrar esta visita')
                } else if (res.type === 'already-archived') {
                    setError(
                        'Estás intentando registrar un estudiante archivado',
                    )
                } else if (res.type === 'already-exists') {
                    setError(
                        'Estás itentando registrar a un estudiante que ya está registrado',
                    )
                } else if (res.type === 'unexpected') {
                    setError('Ocurrió un error inesperado')
                } else if (res.type === 'invalid-input') {
                    // TODO set errors per field
                    if (res.field === 'career_id') {
                        setError('La carrera seleccionada no es válida')
                    } else if (res.field === 'firstname') {
                        setError('El nombre no es válido')
                    } else if (res.field === 'lastname') {
                        setError('El apellido no es válido')
                    } else if (res.field === 'semester') {
                        setError('El semestre no es válido')
                    } else if (res.field === 'group') {
                        setError('El grupo no es válido')
                    }
                }
            })
        },
        [refreshTable, router, setError],
    )

    // debounce findStudent
    useEffect(() => {
        const timeout = setTimeout(() => {
            startTransition(async () => {
                const student = await getStudent(nc)
                if (!student) return setModified(true)
                setName(student.firstname)
                setLastname(student.lastname)
                setCareerId(student.career_id)
                setSemester(student.semester + '')
                setModified(false)
            })
        }, 500)

        return () => clearTimeout(timeout)
    }, [nc])

    return (
        <form action={onAction} className='flex w-full flex-col gap-2'>
            <input
                type='hidden'
                name='laboratory_id'
                value={props.laboratory_id}
            />
            <CompletInput
                label={t('control_number')}
                required
                value={nc}
                onChange={e => {
                    setNc(e.currentTarget.value)
                }}
                name='student_nc'
            />
            <CompletInput
                label={t('names')}
                required
                name='firstname'
                value={name}
                onChange={e => setName(e.currentTarget.value)}
                disabled={!modified}
            />
            <CompletInput
                label={t('surnames')}
                required
                name='lastname'
                value={lastname}
                onChange={e => setLastname(e.currentTarget.value)}
                disabled={!modified}
            />
            <CompletSelect
                label={t('career')}
                required
                name='career_id'
                value={{
                    label: careers.find(c => c.id === career_id)?.name,
                    value: career_id,
                }}
                isClearable={false}
                isDisabled={!modified}
                onChange={e => {
                    setCareerId(e!.value)
                }}
                options={careers.map(c => ({ label: c.name, value: c.id }))}
            />
            <CompletInput
                required
                label={t('semester')}
                name='semester'
                type='number'
                value={semester}
                onChange={e => setSemester(e.currentTarget.value)}
                disabled={!modified}
            />
            <LabeledSwitch
                required
                label={t('credential_confirmation')}
                name='credencial'
            />
            <Button
                type='submit'
                className='mt-2 w-full'
                disabled={inTransition}
            >
                <SquarePenIcon className='mr-2 h-5 w-5' />
                {t('register_visit')}
            </Button>
        </form>
    )
}
