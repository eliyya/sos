'use client'

import { SquarePenIcon } from 'lucide-react'
import { CompletInput } from '@/components/Inputs'
import { useAtom } from 'jotai'
import { errorNameAtom, nameAtom } from '@/global/managment-laboratory'

export function NameInput() {
    const [name, setName] = useAtom(nameAtom)
    const [error, setError] = useAtom(errorNameAtom)

    return (
        <CompletInput
            required
            label='Nombre'
            type='text'
            name='name'
            icon={SquarePenIcon}
            value={name}
            onChange={e => {
                setName(e.target.value)
                setError('')
            }}
            error={error}
        />
    )
}
