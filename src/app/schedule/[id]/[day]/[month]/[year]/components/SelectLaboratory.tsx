'use client'

import { SimpleSelect } from '@/components/Select'
import app from '@eliyya/type-routes'
import { usePathname, useRouter } from 'next/navigation'

interface SelectLaboratoryProps {
    labs: { id: string; name: string }[]
    lab_id: string
}
export function SelectLaboratory({ labs, lab_id }: SelectLaboratoryProps) {
    const { push } = useRouter()
    const pathname = usePathname()
    const [year, month, day] = pathname.split('/').toReversed()

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
                push(
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
