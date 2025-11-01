'use client'

import app from '@eliyya/type-routes'
import { useParams, useRouter } from 'next/navigation'
import { SimpleSelect } from '@/components/Select'

interface SelectLaboratoryProps {
    labs: { id: string; name: string }[]
}
export function SelectLaboratory({ labs }: SelectLaboratoryProps) {
    const { push } = useRouter()
    const { id, year, month, day } = useParams<{
        id: string
        year: string
        month: string
        day: string
    }>()

    return (
        <SimpleSelect
            value={{
                label: labs.find(l => l.id === id)?.name ?? id,
                value: id,
            }}
            options={labs.map(l => ({
                label: l.name,
                value: l.id,
            }))}
            onChange={value => {
                push(
                    app.$locale.schedule.$id.$day.$month.$year(
                        'es',
                        value?.value ?? '',
                        day,
                        month,
                        year,
                    ),
                )
            }}
        />
    )
}
