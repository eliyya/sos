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
import { startOfWeek } from '@/lib/utils'

interface CalendarProps {
    startHour: string
    endHour: string
    /**
     * The date to be displayed in the calendar in timestamp format
     */
    timestamp: number
    labId: string
    isAdmin?: boolean
}

export const Calendar = ({
    endHour,
    startHour,
    timestamp,
    labId,
    isAdmin,
}: CalendarProps) => {
    const router = useRouter()
    const openCreate = useSetAtom(openCreateAtom)
    const setStartHour = useSetAtom(createDayAtom)
    const newEventSignal = useAtomValue(newEventSignalAtom)
    const [events, setEvents] = useAtom(eventsAtom)

    useEffect(() => {
        getPracticesFromWeek({
            timestamp,
            labId,
        }).then(e =>
            setEvents(
                e.map(e => ({
                    id: e.id,
                    title: e.name,
                    start: e.starts_at.getTime(),
                    end: e.ends_at.getTime(),
                })),
            ),
        )
    }, [newEventSignal, setEvents, labId, timestamp])

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
                console.log('Click date:', info.date)

                const clicketTimestamp = info.date.getTime()
                // When a date is clicked in the calendar, this handler determines if the user can create an event
                // based on the following rules:

                // 1. Get the current date and time in Monterrey timezone
                const now = Temporal.Now.zonedDateTimeISO('America/Monterrey')

                // 2. Normalize both dates to the start of their respective weeks (Monday at 00:00:00)
                const nowWeek = startOfWeek(now)

                // 3. Get the clicked date and normalize it to the start of its week
                const clicked =
                    Temporal.Instant.fromEpochMilliseconds(
                        clicketTimestamp,
                    ).toZonedDateTimeISO('America/Monterrey')
                const clickedWeek = startOfWeek(clicked)

                // 4. Check if the clicked date is in the current week
                if (clickedWeek.equals(nowWeek)) {
                    // If in current week, allow event creation
                    setStartHour(clicketTimestamp)
                    return openCreate(true)
                }

                // 5. Check if the clicked date is in a past week
                if (clickedWeek.epochMilliseconds < nowWeek.epochMilliseconds) {
                    // Past weeks are not allowed
                    return
                }

                // 6. Calculate the next week
                const futureWeek = nowWeek.add({
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
                    clickedWeek.epochMilliseconds > now.epochMilliseconds &&
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
                        const currentWeek = startOfWeek(now)

                        const requested =
                            Temporal.Instant.fromEpochMilliseconds(
                                timestamp,
                            ).toZonedDateTimeISO('America/Monterrey')
                        const requestedWeek = startOfWeek(requested)
                        if (!requestedWeek.equals(currentWeek)) {
                            router.push(
                                app.schedule.$id.$day.$month.$year(
                                    labId,
                                    requestedWeek.day,
                                    requestedWeek.month,
                                    requestedWeek.year,
                                ),
                            )
                        }
                        if (!requestedWeek.equals(currentWeek)) {
                            router.push(
                                app.schedule.$id.$day.$month.$year(
                                    labId,
                                    currentWeek.day,
                                    currentWeek.month,
                                    currentWeek.year,
                                ),
                            )
                        }
                    },
                },
                goNext: {
                    text: '>',
                    click: () => {
                        const requested =
                            Temporal.Instant.fromEpochMilliseconds(
                                timestamp,
                            ).toZonedDateTimeISO('America/Monterrey')
                        const nextWeek = requested.add({
                            days: 7,
                        })

                        return router.push(
                            app.schedule.$id.$day.$month.$year(
                                labId,
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
                        const requested =
                            Temporal.Instant.fromEpochMilliseconds(
                                timestamp,
                            ).toZonedDateTimeISO('America/Monterrey')
                        const prevWeek = requested.subtract({
                            days: 7,
                        })
                        return router.push(
                            app.schedule.$id.$day.$month.$year(
                                labId,
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
