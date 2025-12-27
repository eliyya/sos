import { InvalidInputError, PrismaError } from '@/errors'
import { PrismaService } from '@/layers/db.layer'
import { getStartOfWeek } from '@/lib/utils'
import { Temporal } from '@js-temporal/polyfill'
import { Effect } from 'effect'
import { requirePermission } from './auth.service'
import { PERMISSIONS_FLAGS } from '@/bitfields/PermissionsBitField'
import { z } from 'zod'
import '@zod-plugin/effect'
import { STATUS } from '@/prisma/client/enums'

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
    teacher_id,
    class_id,
}: {
    lab_id: string
    timestamp: number
    teacher_id?: string
    class_id?: string
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
                            teacher_id,
                            class_id,
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

export const reserveLaboratorySchema = z
    .object({
        topic: z.string().min(1, 'El tema de la práctica es obligatorio'),

        name: z.string().min(1, 'El nombre de la práctica es obligatorio'),

        class_id: z.string().min(1, 'La clase es obligatoria'),

        starts_at: z
            .number()
            .int('El timestamp de inicio debe ser un entero')
            .positive('El timestamp de inicio debe ser positivo'),

        ends_at: z
            .number()
            .int('El timestamp de fin debe ser un entero')
            .positive('El timestamp de fin debe ser positivo'),

        students: z
            .number()
            .int('La cantidad de estudiantes debe ser un entero')
            .min(0, 'No puede haber menos de 0 estudiantes'),

        laboratory_id: z.string(),
    })
    .refine(data => data.ends_at > data.starts_at, {
        message: 'La hora de fin debe ser posterior a la hora de inicio',
        path: ['ends_at'],
    })

export type ReserveLaboratoryEffectProps = z.infer<
    typeof reserveLaboratorySchema
>
export function reserveLaboratoryEffect(data: ReserveLaboratoryEffectProps) {
    return Effect.gen(function* (_) {
        const session = yield* _(
            requirePermission(PERMISSIONS_FLAGS.RESERVE_SELF),
        )
        const {
            class_id,
            ends_at,
            name,
            starts_at,
            students,
            topic,
            laboratory_id,
        } = yield* _(reserveLaboratorySchema.effect.parseSync(data))

        const prisma = yield* _(PrismaService)
        const clase = yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.class.findUnique({
                        where: { id: class_id },
                        select: {
                            status: true,
                            subject: { select: { practice_hours: true } },
                        },
                    }),
                catch: cause => new PrismaError({ cause }),
            }),
        )
        if (!clase) {
            return Effect.fail(
                new InvalidInputError({
                    field: 'class_id',
                    message: 'class not found',
                }),
            )
        }
        if (clase.status != STATUS.ACTIVE) {
            yield* _(
                Effect.fail(
                    new InvalidInputError({
                        field: 'class_id',
                        message: 'class not found',
                    }),
                ),
            )
        }

        const practices = yield* _(
            getPracticesFromWeekEffect({
                lab_id: laboratory_id,
                timestamp: starts_at,
                teacher_id: session.userId,
                class_id,
            }),
        )

        const hours =
            practices
                .map(p => p.ends_at.getTime() - p.starts_at.getTime())
                .reduce((a, b) => a + b, 0) +
            ends_at -
            starts_at / 3_600_000

        if (hours >= clase.subject.practice_hours) {
            return Effect.fail(
                new InvalidInputError({
                    field: 'ends_at',
                    message:
                        'Excede las horas de práctica permitidas para la materia',
                }),
            )
        }

        return yield* _(
            Effect.tryPromise({
                try: () =>
                    prisma.reservation.create({
                        data: {
                            topic,
                            name,
                            students,
                            teacher_id: session.userId,
                            class_id,
                            laboratory_id,
                            registered_by: session.userId,
                            starts_at: new Date(starts_at),
                            ends_at: new Date(ends_at),
                        },
                    }),
                catch: cause => new PrismaError(cause),
            }),
        )
    })
}
