'use client'

import { getActiveCareers } from '@/actions/career'
import { registerVisit } from '@/actions/cc'
import { findStudent } from '@/actions/students'
import { Button } from '@/components/Button'
import { CompletInput } from '@/components/Inputs'
import { CompletSelect } from '@/components/Select'
import ToggleSwitch from '@/components/Switch'
import { errorAtom, updateTableAtom } from '@/global/cc'
import { Career } from '@prisma/client'
import { useSetAtom } from 'jotai'
import { SquarePenIcon } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'

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
    const [careers, setCareers] = useState<Career[]>([])
    const setError = useSetAtom(errorAtom)
    const refreshTable = useSetAtom(updateTableAtom)

    useEffect(() => {
        async function fetchCareers() {
            const response = await getActiveCareers()
            setCareers(response)
        }
        fetchCareers()
    }, [])

    // debounce findStudent
    useEffect(() => {
        const timeout = setTimeout(() => {
            startTransition(async () => {
                const student = await findStudent(nc)
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
        <form
            action={async formData => {
                const { error } = await registerVisit(formData)
                if (error) return setError(error)
                refreshTable(Symbol())
                setNc('')
                setName('')
                setLastname('')
                setSemester('')
                setModified(true)
            }}
            className='flex w-full flex-col gap-2'
        >
            <input
                type='hidden'
                name='laboratory_id'
                value={props.laboratory_id}
            />
            <CompletInput
                label='Numero de control'
                required
                value={nc}
                onChange={e => {
                    setNc(e.currentTarget.value)
                }}
                name='student_nc'
            ></CompletInput>
            <CompletInput
                label='Nombres'
                required
                name='firstname'
                value={name}
                onChange={e => setName(e.currentTarget.value)}
                disabled={!modified}
            ></CompletInput>
            <CompletInput
                label='Apellidos'
                required
                name='lastname'
                value={lastname}
                onChange={e => setLastname(e.currentTarget.value)}
                disabled={!modified}
            ></CompletInput>
            <CompletSelect
                label='Carrera'
                required
                name='career_id'
                value={{
                    label: careers.find(c => c.id === career_id)?.name,
                    value: career_id,
                }}
                isClearable={false}
                defaultValue={{
                    label: careers[0]?.name,
                    value: careers[0]?.id,
                }}
                isDisabled={!modified}
                onChange={e => {
                    setCareerId(e!.value)
                }}
                options={careers.map(c => ({ label: c.name, value: c.id }))}
            ></CompletSelect>
            <CompletInput
                required
                label='Semestre'
                name='semester'
                type='number'
                value={semester}
                onChange={e => setSemester(e.currentTarget.value)}
                disabled={!modified}
            ></CompletInput>
            <ToggleSwitch
                label='El estudiante porta la credencial'
                name='credencial'
            />
            <Button
                type='submit'
                className='mt-2 w-full'
                disabled={inTransition}
            >
                <SquarePenIcon className='mr-2 h-5 w-5' />
                Registrar visita
            </Button>
        </form>
    )
}
