'use client'

import app from '@eliyya/type-routes'
import { useRouter } from 'next/navigation'
import { SimpleSelect } from '@/components/Select'

interface SelectLaboratoryProps {
    labs: { id: string; name: string }[]
    cc_id: string
    month: string
    year: string
}
export function SelectLaboratory({
    labs,
    cc_id,
    month,
    year,
}: SelectLaboratoryProps) {
    const { replace } = useRouter()
    return (
        <SimpleSelect
            value={{
                label: labs.find(l => l.id === cc_id)?.name ?? cc_id,
                value: cc_id,
            }}
            options={labs.map(l => ({
                label: l.name,
                value: l.id,
            }))}
            onChange={value => {
                replace(
                    app.$locale.dashboard.reports.cc.$cc_id.$month.$year(
                        'es',
                        value?.value ?? '',
                        month,
                        year,
                    ),
                )
            }}
        />
    )
}
