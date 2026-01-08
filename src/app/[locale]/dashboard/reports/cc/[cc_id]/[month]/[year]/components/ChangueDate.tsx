'use client'

import app from '@eliyya/type-routes'
import { CalendarSearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { SimpleInput } from '@/components/Inputs'
import { useTranslations } from 'next-intl'

interface ChangueDateProps {
    lab_id: string
}
export function ChangueDate({ lab_id }: ChangueDateProps) {
    const router = useRouter()
    const t = useTranslations('reports')
    return (
        <form
            className='flex items-center gap-2'
            action={data => {
                const dateString = data.get('search')
                if (!dateString || typeof dateString !== 'string') return
                const [y, m] = dateString.split('-')
                router.push(
                    app.$locale.dashboard.reports.cc.$cc_id.$month.$year(
                        'es',
                        lab_id,
                        m,
                        y,
                    ),
                )
            }}
        >
            <label htmlFor='search' className='text-nowrap'>
                {t('change_month')}
            </label>
            <SimpleInput name='search' type='month' id='search' />
            <Button type='submit'>
                <CalendarSearchIcon />
            </Button>
        </form>
    )
}
