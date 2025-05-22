import type { Temporal } from '@js-temporal/polyfill'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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

export function minutesToTime(minutes: number): `${string}:${string}` {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export function startOfWeek(date: Temporal.ZonedDateTime) {
    return date
        .with({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0,
            microsecond: 0,
            nanosecond: 0,
        })
        .subtract({ days: date.dayOfWeek })
}
