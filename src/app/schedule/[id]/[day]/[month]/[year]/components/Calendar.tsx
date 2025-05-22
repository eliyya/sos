'use client'

import {
    createDayAtom,
    eventsAtom,
    newEventSignalAtom,
    openCreateAtom,
} from '@/global/management-practices'
import { useRouter } from 'next/navigation'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import FullCalendar from '@fullcalendar/react'
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
    isAdmin?: boolean
}

export const Calendar = ({
    endHour,
    startHour,
    timestamp,
    id,
    isAdmin,
}: CalendarProps) => {
    const router = useRouter()
    const openCreate = useSetAtom(openCreateAtom)
    const setStartHour = useSetAtom(createDayAtom)
    const newEventSignal = useAtomValue(newEventSignalAtom)
    const [events, setEvents] = useAtom(eventsAtom)

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
                const clicketTimestamp = info.date.getTime()
                // When a date is clicked in the calendar, this handler determines if the user can create an event
                // based on the following rules:

                // 1. Get the current date and time in Monterrey timezone
                const current = Temporal.ZonedDateTime.from({
                    timeZone: 'America/Monterrey',
                    epochMilliseconds: timestamp,
                })

                // 2. Normalize both dates to the start of their respective weeks (Monday at 00:00:00)
                const currentWeek = current.subtract({
                    days: current.dayOfWeek,
                    hours: current.hour,
                    minutes: current.minute,
                    seconds: current.second,
                    milliseconds: current.millisecond,
                })

                // 3. Get the clicked date and normalize it to the start of its week
                const clicked = Temporal.ZonedDateTime.from({
                    timeZone: 'America/Monterrey',
                    epochMilliseconds: clicketTimestamp,
                })
                const clickedWeek = clicked.subtract({
                    days: clicked.dayOfWeek,
                    hours: clicked.hour,
                    minutes: clicked.minute,
                    seconds: clicked.second,
                    milliseconds: clicked.millisecond,
                })

                // 4. Check if the clicked date is in the current week
                if (clickedWeek.equals(currentWeek)) {
                    // If in current week, allow event creation
                    setStartHour(clicketTimestamp)
                    return openCreate(true)
                }

                // 5. Check if the clicked date is in a past week
                if (
                    clickedWeek.epochMilliseconds <
                    currentWeek.epochMilliseconds
                ) {
                    // Past weeks are not allowed
                    return
                }

                // 6. Calculate the next week
                const futureWeek = currentWeek.add({
                    days: 7,
                })

                // 7. Check if the clicked date is in the next week
                if (clickedWeek.equals(futureWeek)) {
                    // If in next week, allow event creation
                    setStartHour(clicketTimestamp)
                    return openCreate(true)
                }

                // 8. Check if the clicked date is in a future week and user has admin privileges
                if (
                    clickedWeek.epochMilliseconds > current.epochMilliseconds &&
                    isAdmin
                ) {
                    // Admin users can create events in future weeks
                    setStartHour(clicketTimestamp)
                    return openCreate(true)
                }
            }}
            customButtons={{
                goToday: {
                    text: 'today',
                    click: () => {
                        const now =
                            Temporal.Now.zonedDateTimeISO('America/Monterrey')
                        const currentWeek = now.subtract({
                            days: now.dayOfWeek,
                            hours: now.hour,
                            minutes: now.minute,
                            seconds: now.second,
                            milliseconds: now.millisecond,
                        })

                        const requested = Temporal.ZonedDateTime.from({
                            timeZone: 'America/Monterrey',
                            epochMilliseconds: timestamp,
                        })
                        const requestedWeek = requested.subtract({
                            days: requested.dayOfWeek,
                            hours: requested.hour,
                            minutes: requested.minute,
                            seconds: requested.second,
                            milliseconds: requested.millisecond,
                        })

                        if (!requestedWeek.equals(currentWeek)) {
                            router.push(
                                app.schedule.$id.$day.$month.$year(
                                    id,
                                    requested.day,
                                    requested.month,
                                    requested.year,
                                ),
                            )
                        }
                    },
                },
                goNext: {
                    text: '>',
                    click: () => {
                        const requested = Temporal.ZonedDateTime.from({
                            timeZone: 'America/Monterrey',
                            epochMilliseconds: timestamp,
                        })
                        const nextWeek = requested.add({
                            days: 7,
                        })
                        return router.push(
                            app.schedule.$id.$day.$month.$year(
                                id,
                                nextWeek.day,
                                nextWeek.month,
                                nextWeek.year,
                            ),
                        )
                    },
                },
                goPrev: {
                    text: '<',
                    click: () => {
                        const requested = Temporal.ZonedDateTime.from({
                            timeZone: 'America/Monterrey',
                            epochMilliseconds: timestamp,
                        })
                        const prevWeek = requested.subtract({
                            days: 7,
                        })
                        return router.push(
                            app.schedule.$id.$day.$month.$year(
                                id,
                                prevWeek.day,
                                prevWeek.month,
                                prevWeek.year,
                            ),
                        )
                    },
                },
            }}
        />
    )
}
