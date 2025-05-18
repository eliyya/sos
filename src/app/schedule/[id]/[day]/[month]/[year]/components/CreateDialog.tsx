'use client'

import {
    actualEventAtom,
    createDayAtom,
    openCreateAtom,
} from '@/global/management-practices'
import { Dialog, DialogContent, DialogTitle } from '@/components/Dialog'
import interactionPlugin from '@fullcalendar/interaction'
import { EventInput } from '@fullcalendar/core/index.js'
import timeGridPlugin from '@fullcalendar/timegrid'
import { CompletSelect } from '@/components/Select'
import { CompletInput } from '@/components/Inputs'
import { createlab } from '@/actions/laboratory'
import { useEffect, useState, useTransition } from 'react'
import FullCalendar from '@fullcalendar/react'
import { Button } from '@/components/Button'
import { User, Save } from 'lucide-react'
import { useAtom } from 'jotai'
import { minutesToTime } from '@/lib/utils'

interface CreateDialogProps {
    users: {
        id: string
        name: string
    }[]
    disabled?: boolean
    /**
     * * The start hour of the laboratory in minutes from 00:00
     */
    startHour: number
    /**
     * * The end hour of the laboratory in minutes from 00:00
     */
    endHour: number
    events: EventInput[]
    lab_name: string
}
export function CreateDialog({
    users,
    disabled,
    events,
    endHour,
    startHour,
    lab_name,
}: CreateDialogProps) {
    const [open, setOpen] = useAtom(openCreateAtom)
    const [message, setMessage] = useState('')
    const [inTransition, startTransition] = useTransition()
    const [day] = useAtom(createDayAtom)
    const [actualEvent, setActualEvent] = useAtom(actualEventAtom)
    const [startHourInputValue, setStartHourInputValue] = useState('08:00')
    const [endTime, setEndTime] = useState(1)
    const [title, setTitle] = useState('')

    useEffect(() => {
        setStartHourInputValue(
            day.getHours().toString().padStart(2, '0') +
                ':' +
                day.getMinutes().toString().padStart(2, '0'),
        )
    }, [day])

    useEffect(() => {
        const start = new Date(day)
        start.setHours(
            parseInt(startHourInputValue.split(':')[0]),
            parseInt(startHourInputValue.split(':')[1]),
        )
        const end = new Date(start)
        end.setHours(end.getHours() + endTime)
        setActualEvent(a => ({ ...a, start, end }))
    }, [day, setActualEvent, startHourInputValue, endTime])

    useEffect(() => {
        setActualEvent(a => ({ ...a, title }))
    }, [setActualEvent, title])

    return (
        <Dialog open={open && !disabled} onOpenChange={setOpen}>
            <DialogContent className='w-full max-w-3xl'>
                <DialogTitle className='flex flex-col gap-4'>
                    <span className='w-full text-center text-3xl'>
                        Apartar el laboratorio &quot;{lab_name}&quot;
                    </span>
                </DialogTitle>
                {/* <DialogDescription>
                    Edit the user&apos;s information
                </DialogDescription> */}
                <div className='flex gap-8'>
                    <form
                        className='flex w-full max-w-md flex-2/5 flex-col justify-center gap-6'
                        action={data => {
                            startTransition(async () => {
                                const { error } = await createlab(data)
                                if (error) setMessage(error)
                                else setOpen(false)
                                setTimeout(() => {
                                    setMessage('')
                                }, 5_000)
                            })
                        }}
                    >
                        {message && (
                            <span className='animate-slide-in mt-1 block rounded-lg bg-red-100 px-3 py-1 text-sm text-red-600 shadow-md'>
                                {message}
                            </span>
                        )}
                        <CompletSelect
                            label='Usuario'
                            options={users.map(u => ({
                                value: u.id,
                                label: u.name,
                            }))}
                            defaultValue={{
                                label: users[0].name,
                                value: users[0].id,
                            }}
                            isClearable={false}
                            isDisabled={users.length === 1}
                        ></CompletSelect>
                        <CompletInput
                            required
                            label='Tema'
                            type='text'
                            name='topic'
                            value={title}
                            onChange={e => {
                                setTitle(e.target.value)
                            }}
                        >
                            <User className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                        </CompletInput>
                        <CompletInput
                            required
                            label='Inicio'
                            type='time'
                            name='starts_at'
                            value={startHourInputValue}
                            onChange={e => {
                                setStartHourInputValue(e.target.value)
                            }}
                            min={minutesToTime(startHour)}
                        >
                            <User className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                        </CompletInput>
                        <CompletInput
                            required
                            label='Tiempo en horas'
                            type='number'
                            name='time'
                            defaultValue={1}
                            min={1}
                            value={endTime}
                            onChange={e => {
                                const value = parseInt(e.target.value)
                                setEndTime(value)
                            }}
                        >
                            <User className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                        </CompletInput>
                        <CompletInput
                            required
                            label='Contraseña'
                            type='password'
                            name='password'
                            placeholder='* * * * * * * *'
                        >
                            <User className='absolute top-2.5 left-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                        </CompletInput>

                        <Button type='submit' disabled={inTransition}>
                            <Save className='mr-2 h-5 w-5' />
                            Apartar
                        </Button>
                    </form>
                    <div className='flex-3/5'>
                        <FullCalendar
                            eventClassNames={'cursor-pointer'}
                            plugins={[timeGridPlugin, interactionPlugin]}
                            dayHeaderClassNames={'bg-background'}
                            initialView='timeGridDay'
                            allDaySlot={false}
                            headerToolbar={{
                                left: 'title',
                                center: '',
                                right: '',
                            }}
                            slotMinTime={minutesToTime(startHour) + ':00'}
                            slotMaxTime={minutesToTime(endHour) + ':00'}
                            height='auto'
                            initialDate={day}
                            events={[...events, actualEvent]}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
