'use server'

import { getStartOfWeek } from '@/lib/utils'
import { db } from '@/prisma/db'
import { Temporal } from '@js-temporal/polyfill'
import { Prisma, STATUS } from '@prisma/client'

interface getPracticesFromWeekProps {
    labId: string
    timestamp: number
}

export async function getPracticesFromWeek({
    timestamp,
    labId: laboratory_id,
}: getPracticesFromWeekProps) {
    const date =
        Temporal.Instant.fromEpochMilliseconds(timestamp).toZonedDateTimeISO(
            'America/Monterrey',
        )

    const start = getStartOfWeek(date)
    const end = start.add({ days: 7 })

    const practices = await db.practice.findMany({
        where: {
            laboratory_id,
            status: STATUS.ACTIVE,
            starts_at: {
                gte: new Date(start.epochMilliseconds),
                lt: new Date(end.epochMilliseconds),
            },
        },
    })
    return practices
}

export async function getPractice<T extends Prisma.PracticeFindFirstArgs>(
    query: T,
): Promise<Awaited<ReturnType<typeof db.practice.findFirst<T>>>> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await db.practice.findFirst(query)
}
