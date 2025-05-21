'use client'

import { createDayAtom, openCreateAtom } from '@/global/management-practices'
import interactionPlugin from '@fullcalendar/interaction'
import { EventInput } from '@fullcalendar/core/index.js'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/react'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { useSetAtom } from 'jotai'
import './calendar.css'

interface CalendarProps {
    startHour: string
    endHour: string
    day: Date
    id: string
    events: EventInput[]
}
export function Calendar({
    endHour,
    startHour,
    day,
    id,
    events,
}: CalendarProps) {
    const { push } = useRouter()
    const openCreate = useSetAtom(openCreateAtom)
    const setStartHour = useSetAtom(createDayAtom)
    return (
        <FullCalendar
            eventClassNames={'cursor-pointer'}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView='timeGridWeek'
            dayHeaderClassNames={'bg-background'}
            headerToolbar={{
                left: 'title',
                center: '',
                right: 'goToday goPrev,goNext',
            }}
            allDaySlot={false}
            hiddenDays={[0, 6]} // Hide Sunday and Saturday
            slotMinTime={startHour}
            slotMaxTime={endHour}
            slotDuration={'01:00:00'}
            height='auto'
            initialDate={day}
            events={events}
            eventClick={info => {
                console.log('Event clicked:', info.event)
            }}
            dateClick={info => {
                console.log('Date clicked:', info.date)
                setStartHour(info.date.getTime())
                openCreate(true)
            }}
            customButtons={{
                goToday: {
                    text: 'today',
                    click: () => {
                        const t = new Date()
                        if (
                            t.getDate() !== day.getDate() ||
                            t.getMonth() !== day.getMonth() ||
                            t.getFullYear() !== day.getFullYear()
                        )
                            push(
                                app.schedule.$id.$day.$month.$year(
                                    id,
                                    t.getDate(),
                                    t.getMonth() + 1,
                                    t.getFullYear(),
                                ),
                            )
                    },
                },
                goNext: {
                    text: '>',
                    click: () => {
                        const t = new Date()
                        t.setDate(t.getDate() + 7)
                        push(
                            app.schedule.$id.$day.$month.$year(
                                id,
                                t.getDate(),
                                t.getMonth() + 1,
                                t.getFullYear(),
                            ),
                        )
                    },
                },
                goPrev: {
                    text: '<',
                    click: () => {
                        const t = new Date()
                        t.setDate(t.getDate() - 7)
                        push(
                            app.schedule.$id.$day.$month.$year(
                                id,
                                t.getDate(),
                                t.getMonth() + 1,
                                t.getFullYear(),
                            ),
                        )
                    },
                },
            }}
        />
    )
}
