'use client'

import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useAtomValue } from 'jotai'
import {
    actualEventAtom,
    createDayAtom,
    eventsAtom,
} from '@/global/management-practices'
import { secondsToTime } from '@/lib/utils'

interface CalendarProps {
    lab: {
        name: string
        id: string
        /**
         * * The end hour of the laboratory in minutes from 00:00
         */
        close_hour: number
        /**
         * * The start hour of the laboratory in minutes from 00:00
         */
        open_hour: number
    }
}

export function CalendarDialog({ lab }: CalendarProps) {
    const timestampStartHour = useAtomValue(createDayAtom)
    const actualEvent = useAtomValue(actualEventAtom)
    const events = useAtomValue(eventsAtom)
    return (
        <div className="p-1 rounded-lg border border-border bg-card">
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView='timeGridDay'
                allDaySlot={false}
                slotDuration={'01:00:00'}
                headerToolbar={{
                    left: 'title',
                    center: '',
                    right: '',
                }}
                dayHeaderFormat={{ weekday: 'long', month: 'long', day: 'numeric' }}
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }}
                slotMinTime={secondsToTime(lab.open_hour * 60, 'HH:mm:ss')}
                slotMaxTime={secondsToTime(lab.close_hour * 60, 'HH:mm:ss')}
                height='auto'
                initialDate={timestampStartHour}
                events={[...events, actualEvent]}
                eventClassNames='rounded-md shadow-sm hover:shadow-md transition-shadow'
                dayHeaderClassNames='bg-background font-semibold p-3'
                slotLabelClassNames='text-muted-foreground text-sm'
                nowIndicator={true}
                eventDisplay="block"
            />
        </div>
    )
}
