'use client'

import { SimpleSelect } from '@/components/Select'
import app from '@eliyya/type-routes'
import { useRouter } from 'next/navigation'

interface SelectLaboratoryProps {
    labs: { id: string; name: string }[]
    lab_id: string
    day: string
    month: string
    year: string
}
export function SelectLaboratory({
    labs,
    lab_id,
    day,
    month,
    year,
}: SelectLaboratoryProps) {
    const { replace } = useRouter()
    return (
        <SimpleSelect
            value={{
                label: labs.find(l => l.id === lab_id)?.name ?? lab_id,
                value: lab_id,
            }}
            options={labs.map(l => ({
                label: l.name,
                value: l.id,
            }))}
            onChange={value => {
                replace(
                    app.schedule.$id.$day.$month.$year(
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
