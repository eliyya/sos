'use server'

import { startOfWeek } from '@/lib/utils'
import { db } from '@/prisma/db'
import { Temporal } from '@js-temporal/polyfill'
import { STATUS } from '@prisma/client'

interface getPracticesFromWeekProps {
    lab_id: string
    timestamp: number
}
export async function getPracticesFromWeek({
    timestamp,
    lab_id,
}: getPracticesFromWeekProps) {
    const date =
        Temporal.Instant.fromEpochMilliseconds(timestamp).toZonedDateTimeISO(
            'America/Monterrey',
        )
    const start = startOfWeek(date)
    const end = start.add({ days: 7 })

    const practices = await db.practice.findMany({
        where: {
            laboratory_id: lab_id,
            status: STATUS.ACTIVE,
            starts_at: {
                gte: new Date(start.epochMilliseconds),
                lt: new Date(end.epochMilliseconds),
            },
        },
    })
    return practices
}
