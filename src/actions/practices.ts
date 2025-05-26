'use server'

import { getStartOfWeek } from '@/lib/utils'
import { db } from '@/prisma/db'
import { Temporal } from '@js-temporal/polyfill'
import { Prisma } from '@prisma/client'

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
            starts_at: {
                gte: new Date(start.epochMilliseconds),
                lt: new Date(end.epochMilliseconds),
            },
        },
    })
    return practices
}

export async function findFirstPractice<T extends Prisma.PracticeFindFirstArgs>(
    query: T,
): Promise<Awaited<ReturnType<typeof db.practice.findFirst<T>>>> {
    return (await db.practice.findFirst(
        query as Prisma.PracticeFindFirstArgs,
    )) as Awaited<ReturnType<typeof db.practice.findFirst<T>>>
}

export async function deletePractice(formData: FormData) {
    const id = formData.get('practice_id') as string
    try {
        await db.practice.delete({ where: { id } })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}

export async function editPractice(formData: FormData) {
    const id = formData.get('practice_id') as string
    const name = formData.get('name') as string
    const observations = formData.get('observations') as string | null
    const starts_at = formData.get('starts_at') as string
    const ends_at = formData.get('ends_at') as string
    const students = formData.get('students') as string
    const topic = formData.get('topic') as string
    try {
        await db.practice.update({
            where: { id },
            data: {
                name,
                observations,
                starts_at,
                ends_at,
                students: parseInt(students),
                topic,
                updated_at: new Date(),
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}
