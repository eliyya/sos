'use client'

import { Button } from '@/components/Button'
import { SimpleInput } from '@/components/Inputs'
import app from '@eliyya/type-routes'
import { Temporal } from '@js-temporal/polyfill'
import { CalendarSearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchInputProps {
    lab_id: string
    /**
     * The current day in epoch milliseconds
     */
    currentDay: number
}
export function SearchInput({ lab_id, currentDay }: SearchInputProps) {
    const router = useRouter()
    return (
        <form
            className='flex items-center gap-2'
            action={data => {
                const dateString = data.get('search')
                if (!dateString || typeof dateString !== 'string') return
                const [y, m, d] = dateString.split('-')
                router.push(app.schedule.$id.$day.$month.$year(lab_id, d, m, y))
            }}
        >
            <label htmlFor='search' className='text-nowrap'>
                Buscar Fecha
            </label>
            <SimpleInput
                name='search'
                type='date'
                id='search'
                defaultValue={Temporal.Instant.fromEpochMilliseconds(currentDay)
                    .toZonedDateTimeISO('America/Monterrey')
                    .toPlainDate()
                    .toString()}
            />
            <Button type='submit'>
                <CalendarSearchIcon />
            </Button>
        </form>
    )
}
