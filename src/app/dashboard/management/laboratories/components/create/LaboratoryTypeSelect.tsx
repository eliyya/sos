'use client'

import { MicroscopeIcon } from 'lucide-react'
import { CompletSelect } from '@/components/Select'
import { errorTypeAtom, typeAtom } from '@/global/managment-laboratory'
import { useAtom } from 'jotai'
import { LABORATORY_TYPE } from '@prisma/client'

export function LaboratoryTypeSelect() {
    const [value, setValue] = useAtom(typeAtom)
    const [error, setError] = useAtom(errorTypeAtom)

    return (
        <CompletSelect
            required
            label='Tipo de Laboratorio'
            name='type'
            value={value}
            onChange={e => {
                setValue({
                    value: e?.value ?? LABORATORY_TYPE.LABORATORY,
                    label: e?.label ?? LABORATORY_TYPE.LABORATORY,
                })
                setError('')
            }}
            error={error}
            options={[
                {
                    value: LABORATORY_TYPE.LABORATORY,
                    label: 'Laboratorio',
                },
                {
                    value: LABORATORY_TYPE.COMPUTER_CENTER,
                    label: 'Centro de Computo',
                },
            ]}
            icon={MicroscopeIcon}
        />
    )
}
