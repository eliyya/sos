'use client'

import { Button } from '@/components/Button'
import { SimpleInput } from '@/components/Inputs'
import app from '@eliyya/type-routes'
import { CalendarSearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ChangueDateProps {
    lab_id: string
}
export function ChangueDate({ lab_id }: ChangueDateProps) {
    const router = useRouter()
    return (
        <form
            className='flex items-center gap-2'
            action={data => {
                const dateString = data.get('search')
                if (!dateString || typeof dateString !== 'string') return
                const [y, m] = dateString.split('-')
                router.push(
                    app.dashboard.reports.lab.$lab_id.$month.$year(
                        lab_id,
                        m,
                        y,
                    ),
                )
            }}
        >
            <label htmlFor='search' className='text-nowrap'>
                Cambiar el Mes
            </label>
            <SimpleInput name='search' type='month' id='search' />
            <Button type='submit'>
                <CalendarSearchIcon />
            </Button>
        </form>
    )
}
