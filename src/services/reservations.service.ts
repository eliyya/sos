import { PrismaError } from '@/errors'
import { PrismaService } from '@/layers/db.layer'
import { getStartOfWeek } from '@/lib/utils'
import { Temporal } from '@js-temporal/polyfill'
import { Effect } from 'effect'

export function getReservationEffect({ id }: { id: string }) {
    return Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)

        const visits = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.reservation.findFirst({
                        where: { id },
                        include: {
                            teacher: true,
                            class: {
                                include: {
                                    subject: true,
                                    career: true,
                                },
                            },
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        return visits
    })
}

export function getPracticesFromWeekEffect({
    lab_id,
    timestamp,
}: {
    lab_id: string
    timestamp: number
}) {
    return Effect.gen(function* (_) {
        const prisma = yield* _(PrismaService)

        const date =
            Temporal.Instant.fromEpochMilliseconds(
                timestamp,
            ).toZonedDateTimeISO('America/Monterrey')

        const start = getStartOfWeek(date)
        const end = start.add({ days: 7 })

        const practices = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.reservation.findMany({
                        where: {
                            laboratory_id: lab_id,
                            starts_at: {
                                gte: new Date(start.epochMilliseconds),
                                lt: new Date(end.epochMilliseconds),
                            },
                        },
                        include: {
                            teacher: true,
                            class: {
                                include: {
                                    subject: true,
                                    career: true,
                                },
                            },
                        },
                    }),
                catch: err => new PrismaError(err),
            }),
        )

        return practices
    })
}
