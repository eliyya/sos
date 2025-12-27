'use client'

import app from '@eliyya/type-routes'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Temporal } from '@js-temporal/polyfill'
import { useAtomValue, useSetAtom } from 'jotai'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import {
    eventsAtom,
    newEventSignalAtom,
    eventInfoAtom,
    reservationsAtom,
} from '@/global/management-practices'
import {
    getCalendarEventInfo,
    getStartOfWeek,
    secondsToTime,
} from '@/lib/utils'
import { getPracticesFromWeekAction } from '@/actions/reservations.actions'
import { authClient } from '@/lib/auth-client'
import {
    PERMISSIONS_FLAGS,
    PermissionsBitField,
} from '@/bitfields/PermissionsBitField'
import { useFormReserveStore } from '@/global/schedule.globals'

interface CalendarProps {
    lab: {
        id: string
        close_hour: number
        open_hour: number
    }
}

export function Calendar({ lab }: CalendarProps) {
    const openReserveDialogOn = useFormReserveStore(s => s.setDate)
    const { push } = useRouter()
    const newEventSignal = useAtomValue(newEventSignalAtom)
    const events = useAtomValue(eventsAtom)
    const setReserves = useSetAtom(reservationsAtom)
    const openEventInfoWith = useSetAtom(eventInfoAtom)
    const { data: session } = authClient.useSession()
    const permissions = useMemo(() => {
        return new PermissionsBitField(session?.user.permissions)
    }, [session])

    const [year, month, day] = usePathname().split('/').toReversed()

    const timestamp = Temporal.ZonedDateTime.from({
        timeZone: 'America/Monterrey',
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        hour: Math.floor(lab.open_hour / 60),
    }).epochMilliseconds

    useEffect(() => {
        getPracticesFromWeekAction({
            timestamp,
            lab_id: lab.id,
        }).then(setReserves)
    }, [newEventSignal, lab, timestamp, setReserves])

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
            slotMinTime={secondsToTime(lab.open_hour * 60, 'HH:mm:ss')}
            slotMaxTime={secondsToTime(lab.close_hour * 60, 'HH:mm:ss')}
            slotDuration={'01:00:00'}
            height='auto'
            initialDate={timestamp}
            events={events}
            dateClick={arg => {
                if (
                    !permissions.any([
                        PERMISSIONS_FLAGS.RESERVE_SELF,
                        PERMISSIONS_FLAGS.RESERVE_OTHERS,
                    ])
                )
                    return
                openReserveDialogOn(arg.date.getTime())
            }}
            eventClick={event => {
                const info = getCalendarEventInfo(event.event)
                openEventInfoWith(info)
            }}
            customButtons={{
                goToday: {
                    text: 'today',
                    click: () => {
                        // Get the current date and time in Monterrey timezone
                        const now =
                            Temporal.Now.zonedDateTimeISO('America/Monterrey')
                        // Get the start of the current week (Monday)
                        const currentWeek = getStartOfWeek(now)

                        // Get the selected date from the timestamp prop
                        const selectedDate =
                            Temporal.Instant.fromEpochMilliseconds(
                                timestamp,
                            ).toZonedDateTimeISO('America/Monterrey')
                        // Get the start of the selected week
                        const selectedWeek = getStartOfWeek(selectedDate)

                        // If the selected week is still not the current week
                        // This is a redundant check that should never be true
                        if (!selectedWeek.equals(currentWeek)) {
                            // Navigate to the current week's view
                            push(
                                app.$locale.schedule.$id.$day.$month.$year(
                                    'es',
                                    lab.id,
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
                        const selectedDay =
                            Temporal.Instant.fromEpochMilliseconds(
                                timestamp,
                            ).toZonedDateTimeISO('America/Monterrey')
                        const nextWeek = selectedDay.add({
                            days: 7,
                        })

                        return push(
                            app.$locale.schedule.$id.$day.$month.$year(
                                'es',
                                lab.id,
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
                        const selectedDay =
                            Temporal.Instant.fromEpochMilliseconds(
                                timestamp,
                            ).toZonedDateTimeISO('America/Monterrey')
                        const prevWeek = selectedDay.subtract({
                            days: 7,
                        })
                        return push(
                            app.$locale.schedule.$id.$day.$month.$year(
                                'es',
                                lab.id,
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
