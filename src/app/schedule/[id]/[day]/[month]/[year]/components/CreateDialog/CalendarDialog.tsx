'use client'

import { useEffect, useState } from 'react'
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

    // Estado para rastrear el ancho de la ventana
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 1024
    )

    // Actualizar el ancho cuando cambie el tamaño de la ventana
    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Valores dinámicos basados en el ancho de la ventana
    const isMobile = windowWidth < 640
    const isTablet = windowWidth >= 640 && windowWidth < 1024

    return (
        <div className="p-1 rounded-lg border border-border bg-card">
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView='timeGridDay'
                allDaySlot={false}
                slotDuration={isMobile ? '02:00:00' : '01:00:00'}
                headerToolbar={{
                    left: isMobile ? '' : 'title',
                    center: isMobile ? 'title' : '',
                    right: isMobile ? 'prev,next' : '',
                }}
                dayHeaderFormat={{
                    weekday: isMobile ? 'short' : 'long',
                    month: isMobile ? 'numeric' : 'long',
                    day: 'numeric'
                }}
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
                height={isMobile ? 'auto' : isTablet ? 500 : 600}
                initialDate={timestampStartHour}
                events={[...events, actualEvent]}
                eventClassNames='rounded-md shadow-sm hover:shadow-md transition-shadow'
                dayHeaderClassNames='bg-background font-semibold p-3'
                slotLabelClassNames='text-muted-foreground text-sm'
                nowIndicator={true}
                eventDisplay="block"
                contentHeight={isMobile ? 'auto' : isTablet ? 450 : 550}
                aspectRatio={isMobile ? 0.5 : isTablet ? 1.35 : 1.8}
                eventContent={(arg) => (
                    <div className="p-0.5">
                        <div className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                            {arg.event.title}
                        </div>
                        {!isMobile && (
                            <div className="text-xs opacity-90">
                                {arg.timeText}
                            </div>
                        )}
                    </div>
                )}
            />
        </div>
    )
}
