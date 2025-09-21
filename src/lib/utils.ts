import { EventImpl } from '@fullcalendar/core/internal'
import type { Temporal } from '@js-temporal/polyfill'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ScheduleEvent } from '@/types/schedule'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function wrapTry<T extends (...args: any) => any>(
    fn: T,
    ...args: Parameters<T>
): Promise<[null, Awaited<ReturnType<T>>] | [Error, null]> {
    try {
        return [null, await fn(...args)]
    } catch (e) {
        return [e as Error, null]
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number,
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), delay)
    }
}

export function timeToMinutes(time: string) {
    const [hours, minutes] = time.split(':')
    return parseInt(hours, 10) * 60 + parseInt(minutes, 10)
}

type HourFormat = 'h' | 'hh' | 'H' | 'HH'
type MinuteFormat = 'm' | 'mm'
type SecondFormat = 's' | 'ss'

type TimeFormat =
    | `${HourFormat}:${MinuteFormat}`
    | `${HourFormat}:${MinuteFormat}:${SecondFormat}`

export function secondsToTime<
    F extends TimeFormat = 'HH:mm',
    R = F extends `${HourFormat}:${MinuteFormat}:${SecondFormat}` ?
        `${string}:${string}:${string}`
    :   `${string}:${string}`,
>(seconds: number, format: F = 'HH:mm' as F): R {
    seconds = Math.max(0, seconds)

    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds / 60) % 60)
    const secs = Math.floor(seconds % 60)

    const [hf, mf, sf] = format.split(':') as [
        HourFormat,
        MinuteFormat,
        SecondFormat | undefined,
    ]

    const hourFormat =
        // 24 hour format
        hf === 'H' ? String(hours)
            // 24 hour format with leading zero
        : hf === 'HH' ? String(hours).padStart(2, '0')
            // 12 hour format without leading zero
        : hf === 'hh' ? String(hours % 12 || 12).padStart(2, '0')
            // 12 hour format
        : String(hours % 12 || 12)

    const minuteFormat =
        mf === 'mm' ?
            // leading zero for minutes
            String(mins).padStart(2, '0')
            // no leading zero for minutes
        :   String(mins)

    const secondFormat =
        sf === 's' ?
            // no leading zero for seconds
            String(secs)
            // leading zero for seconds
        :   String(secs).padStart(2, '0')

    return `${hourFormat}:${minuteFormat}${sf ? `:${secondFormat}` : ''}` as R
}

export function getStartOfWeek(date: Temporal.ZonedDateTime) {
    return date
        .with({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
            microsecond: 0,
            nanosecond: 0,
        })
        .subtract({ days: date.dayOfWeek % 7 })
}

export function getCalendarEventInfo(event: EventImpl): ScheduleEvent {
    return {
        ...event,
        ownerId: event.extendedProps?.ownerId ?? '',
        start:
            event.start instanceof Date ? event.start.getTime()
            : typeof event.start === 'number' ? event.start
            : event.start ? new Date(event.start).getTime()
            : 0,
        end:
            event.end instanceof Date ? event.end.getTime()
            : typeof event.end === 'number' ? event.end
            : event.end ? new Date(event.end).getTime()
            : 0,
        id: event.id,
        color: event.backgroundColor,
    }
}

export function setTime(
    dateTime: Temporal.ZonedDateTime,
    time: string,
): Temporal.ZonedDateTime {
    const [hourStr, minuteStr] = time.split(':')
    const hour = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr, 10)

    const updatedPlainDateTime = dateTime.toPlainDate().toPlainDateTime({
        hour,
        minute,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0,
    })

    return updatedPlainDateTime.toZonedDateTime(dateTime.timeZoneId)
}

export function capitalize(str: string) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export function truncateByUnderscore(str: string, maxLength = 30) {
    const parts = str.split('_')
    let result = ''

    for (const part of parts) {
        if (result.length === 0) {
            if (part.length > maxLength) {
                return part.slice(0, maxLength)
            }
            result = part
        } else {
            if (result.length + 1 + part.length <= maxLength)
                result += '_' + part
            else break
        }
    }

    return result
}
