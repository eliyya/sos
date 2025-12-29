'use client'

import app from '@eliyya/type-routes'
import { Temporal } from '@js-temporal/polyfill'
import { ChevronDownIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'

export function SearchInput() {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { year, month, day, id } = useParams<{
        year: string
        month: string
        day: string
        id: string
    }>()
    return (
        <div className='flex flex-col gap-3'>
            <Label htmlFor='date' className='px-1'>
                Buscar Fecha
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                    render={
                        <Button
                            variant='outline'
                            id='date'
                            className='w-48 justify-between font-normal'
                        >
                            {Temporal.PlainDate.from({
                                year: Number(year),
                                month: Number(month),
                                day: Number(day),
                            }).toLocaleString('es-MX')}
                            <ChevronDownIcon />
                        </Button>
                    }
                ></PopoverTrigger>
                <PopoverContent
                    className='w-auto overflow-hidden p-0'
                    align='start'
                >
                    <Calendar
                        mode='single'
                        selected={
                            new Date(
                                Temporal.PlainDate.from({
                                    year: Number(year),
                                    month: Number(month),
                                    day: Number(day),
                                }).toZonedDateTime('America/Monterrey')
                                    .epochMilliseconds,
                            )
                        }
                        captionLayout='dropdown'
                        onSelect={date => {
                            setOpen(false)
                            if (!date) return
                            const time = Temporal.Instant.fromEpochMilliseconds(
                                date.getTime(),
                            ).toZonedDateTimeISO('America/Monterrey')
                            router.push(
                                app.$locale.schedule.$id.$day.$month.$year(
                                    'es',
                                    id,
                                    time.day,
                                    time.month,
                                    time.year,
                                ),
                            )
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
