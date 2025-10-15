'use client'

import app from '@eliyya/type-routes'
import { Temporal } from '@js-temporal/polyfill'
import { CalendarSearchIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import { SimpleInput } from '@/components/Inputs'

export function SearchInput() {
    const router = useRouter()
    const { year, month, day, id } = useParams<{
        year: string
        month: string
        day: string
        id: string
    }>()

    const currentDay = Temporal.ZonedDateTime.from({
        timeZone: 'America/Monterrey',
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
    })

    return (
        <form
            className='flex items-center gap-2'
            action={data => {
                const dateString = data.get('search')
                if (!dateString || typeof dateString !== 'string') return
                const [y, m, d] = dateString.split('-')
                router.push(app.schedule.$id.$day.$month.$year(id, d, m, y))
            }}
        >
            <label htmlFor='search' className='text-nowrap'>
                Buscar Fecha
            </label>
            <SimpleInput
                name='search'
                type='date'
                id='search'
                defaultValue={currentDay.toPlainDate().toString()}
            />
            <Button type='submit'>
                <CalendarSearchIcon />
            </Button>
        </form>
    )
}
