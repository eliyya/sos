'use client'

import app from '@eliyya/type-routes'
import { useRouter } from 'next/navigation'
import { SimpleSelect } from '@/components/Select'

interface SelectLaboratoryProps {
    labs: { id: string; name: string }[]
    lab_id: string
    month: string
    year: string
}
export function SelectLaboratory({
    labs,
    lab_id,
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
                    app.dashboard.reports.lab.$lab_id.$month.$year(
                        value?.value ?? '',
                        month,
                        year,
                    ),
                )
            }}
        />
    )
}
