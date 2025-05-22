'use client'

import {
    createDayAtom,
    eventsAtom,
    newEventSignalAtom,
    openCreateAtom,
} from '@/global/management-practices'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/react'
import { useRouter } from 'next/navigation'
import app from '@eliyya/type-routes'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import './calendar.css'
import { useEffect } from 'react'
import { getPracticesFromWeek } from '@/actions/practices'
import { Temporal } from '@js-temporal/polyfill'

interface CalendarProps {
    startHour: string
    endHour: string
    /**
     * The date to be displayed in the calendar in timestamp format
     */
    timestamp: number
    id: string
}
export function Calendar({ endHour, startHour, timestamp, id }: CalendarProps) {
    const { push } = useRouter()
    const openCreate = useSetAtom(openCreateAtom)
    const setStartHour = useSetAtom(createDayAtom)
    const newEventSignal = useAtomValue(newEventSignalAtom)
    const [events, setEvents] = useAtom(eventsAtom)
    // TODO: change this to a real info
    useEffect(() => {
        getPracticesFromWeek({
            day: 21,
            month: 5,
            year: 2025,
            lab: '447934885395435521',
        }).then(e =>
            setEvents(
                e.map(e => ({
                    id: e.id,
                    title: e.name,
                    start: e.starts_at,
                    end: e.ends_at,
                })),
            ),
        )
    }, [newEventSignal, setEvents])

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
            initialDate={timestamp}
            events={events}
            eventClick={info => {
                console.log('Event clicked:', info.event)
            }}
            dateClick={info => {
                console.log('Date clicked:', info.date, { a: 2 })
                setStartHour(info.date.getTime())
                openCreate(true)
            }}
            customButtons={{
                goToday: {
                    text: 'today',
                    click: () => {
                        const requested = Temporal.ZonedDateTime.from({
                            timeZone: 'America/Monterrey',
                            epochMilliseconds: timestamp,
                        })
                        // if requested date is not in the same week as the current date do:
                        // push(
                        //     app.schedule.$id.$day.$month.$year(
                        //         id,
                        //         requested.day,
                        //         requested.month,
                        //         requested.year,
                        //     ),
                        // )
                        // else do nothing
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
