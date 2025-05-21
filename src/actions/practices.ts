'use server'

import { db } from '@/prisma/db'
import { Temporal } from '@js-temporal/polyfill'
import { STATUS } from '@prisma/client'

interface getPracticesFromWeekProps {
    lab: string
    day: number
    month: number
    year: number
}
export async function getPracticesFromWeek({
    day,
    lab,
    month,
    year,
}: getPracticesFromWeekProps) {
    const date = Temporal.ZonedDateTime.from({
        timeZone: 'America/Monterrey',
        year: year,
        month: month,
        day: day,
        hour: 0,
        minute: 0,
    })
    const start = date.subtract({ days: date.dayOfWeek })
    const end = start.add({ days: 7 })

    const practices = await db.practice.findMany({
        where: {
            laboratory_id: lab,
            status: STATUS.ACTIVE,
            starts_at: {
                gte: new Date(start.epochMilliseconds),
                lt: new Date(end.epochMilliseconds),
            },
        },
    })
    return practices
}
