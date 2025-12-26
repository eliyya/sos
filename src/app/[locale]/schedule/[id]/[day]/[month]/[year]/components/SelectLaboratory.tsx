'use client'

import app from '@eliyya/type-routes'
import { useParams, useRouter } from 'next/navigation'
import { SimpleSelect } from '@/components/Select'
import { startTransition, useEffect, useMemo, useState } from 'react'
import { getLaboratorySelectOptionsAction } from '@/actions/laboratories.actions'

export function SelectLaboratory() {
    const { push } = useRouter()
    const { id, year, month, day } = useParams<{
        id: string
        year: string
        month: string
        day: string
    }>()
    const [labs, setLabs] = useState<{ value: string; label: string }[]>([])
    const selected = useMemo(
        () => labs.find(l => l.value === id) ?? null,
        [id, labs],
    )

    useEffect(() => {
        startTransition(async () =>
            setLabs(await getLaboratorySelectOptionsAction()),
        )
    }, [])

    return (
        <SimpleSelect
            value={selected}
            options={labs}
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
