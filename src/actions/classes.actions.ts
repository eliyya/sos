'use server'

import {
    AlreadyArchivedError,
    AlreadyExistsError,
    InvalidInputError,
    NotFoundError,
    PermissionError,
    PrismaError,
    UnauthorizedError,
    UnexpectedError,
} from '@/errors'
import { AuthLive } from '@/layers/auth.layer'
import { PrismaLive } from '@/layers/db.layer'
import { SuccessOf } from '@/lib/type-utils'
import { getStartOfWeek } from '@/lib/utils'
import { db } from '@/prisma/db'
import {
    archiveClassEffect,
    createClassEffect,
    deleteClassEffect,
    editClassEffect,
    getClassesEffect,
    unarchiveClassEffect,
} from '@/services/classes.service'
import { Temporal } from '@js-temporal/polyfill'
import { Effect } from 'effect'

export async function createClass({
    career_id,
    group,
    semester,
    subject_id,
    teacher_id,
}: Parameters<typeof createClassEffect>[0]) {
    return await Effect.runPromise(
        Effect.scoped(
            createClassEffect({
                career_id,
                group,
                semester,
                subject_id,
                teacher_id,
            })
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: class_ => ({
                            status: 'success' as const,
                            class: class_,
                        }),
                        onFailure: error => {
                            if (error instanceof InvalidInputError) {
                                return {
                                    status: 'error' as const,
                                    type: 'invalid-input' as const,
                                    message: error.message,
                                    field: error.field,
                                } as const
                            }
                            if (error instanceof UnauthorizedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: error.message,
                                } as const
                            }
                            if (error instanceof PrismaError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                } as const
                            }
                            if (error instanceof AlreadyArchivedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'already-archived' as const,
                                    message: error.message,
                                    nc: error.id,
                                } as const
                            }
                            if (error instanceof AlreadyExistsError) {
                                return {
                                    status: 'error' as const,
                                    type: 'already-exists' as const,
                                    message: error.message,
                                    nc: error.id,
                                } as const
                            }
                            if (error instanceof UnexpectedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                } as const
                            }
                            if (error instanceof PermissionError) {
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: error.message,
                                    missings: error.missings,
                                } as const
                            }
                            return {
                                status: 'error' as const,
                                type: 'unexpected' as const,
                                message: String(error),
                            } as const
                        },
                    }),
                ),
        ),
    )
}

export async function editClass({
    career_id,
    group,
    semester,
    id,
    subject_id,
    teacher_id,
}: Parameters<typeof editClassEffect>[0]) {
    return await Effect.runPromise(
        Effect.scoped(
            editClassEffect({
                career_id,
                group,
                semester,
                id,
                subject_id,
                teacher_id,
            })
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: class_ => ({
                            status: 'success' as const,
                            class: class_,
                        }),
                        onFailure: error => {
                            if (error instanceof UnauthorizedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: error.message,
                                }
                            }
                            if (error instanceof PrismaError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                }
                            }
                            if (error instanceof UnexpectedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                }
                            }
                            if (error instanceof PermissionError) {
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: error.message,
                                    missings: error.missings,
                                }
                            }
                            if (error instanceof NotFoundError) {
                                return {
                                    status: 'error' as const,
                                    type: 'not-found' as const,
                                    message: error.message,
                                }
                            }
                            return {
                                status: 'error' as const,
                                type: 'unexpected' as const,
                                message: String(error),
                            }
                        },
                    }),
                ),
        ),
    )
}

export async function deleteClass(id: string) {
    return await Effect.runPromise(
        Effect.scoped(
            deleteClassEffect(id)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: () => ({
                            status: 'success' as const,
                        }),
                        onFailure: error => {
                            if (error instanceof NotFoundError) {
                                return {
                                    status: 'error' as const,
                                    type: 'not-found' as const,
                                    message: error.message,
                                }
                            }
                            if (error instanceof PrismaError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                }
                            }
                            if (error instanceof UnauthorizedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: error.message,
                                }
                            }
                            if (error instanceof UnexpectedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                }
                            }
                            if (error instanceof PermissionError) {
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: error.message,
                                    missings: error.missings,
                                }
                            }
                            return {
                                status: 'error' as const,
                                type: 'unexpected' as const,
                                message: String(error),
                            }
                        },
                    }),
                ),
        ),
    )
}

export async function archiveClass(id: string) {
    return await Effect.runPromise(
        Effect.scoped(
            archiveClassEffect(id)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: class_ => ({
                            status: 'success' as const,
                            class: class_,
                        }),
                        onFailure: error => {
                            if (error instanceof NotFoundError) {
                                return {
                                    status: 'error' as const,
                                    type: 'not-found' as const,
                                    message: error.message,
                                }
                            }
                            if (error instanceof PrismaError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                }
                            }
                            if (error instanceof UnauthorizedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: error.message,
                                }
                            }
                            if (error instanceof PermissionError) {
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: error.message,
                                    missings: error.missings,
                                }
                            }
                            if (error instanceof UnexpectedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                }
                            }
                            return {
                                status: 'error' as const,
                                type: 'unexpected' as const,
                                message: String(error),
                            }
                        },
                    }),
                ),
        ),
    )
}

export async function unarchiveClass(id: string) {
    return await Effect.runPromise(
        Effect.scoped(
            unarchiveClassEffect(id)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: class_ => ({
                            status: 'success' as const,
                            class: class_,
                        }),
                        onFailure: error => {
                            if (error instanceof NotFoundError) {
                                return {
                                    status: 'error' as const,
                                    type: 'not-found' as const,
                                    message: error.message,
                                }
                            }
                            if (error instanceof PrismaError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                }
                            }
                            if (error instanceof UnauthorizedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: error.message,
                                }
                            }
                            if (error instanceof PermissionError) {
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: error.message,
                                    missings: error.missings,
                                }
                            }
                            if (error instanceof UnexpectedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                }
                            }
                            return {
                                status: 'error' as const,
                                type: 'unexpected' as const,
                                message: String(error),
                            }
                        },
                    }),
                ),
        ),
    )
}

export async function getClasses(): Promise<
    SuccessOf<ReturnType<typeof getClassesEffect>>
> {
    return await Effect.runPromise(
        Effect.scoped(
            getClassesEffect()
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.catchAll(error => {
                        console.log(error)
                        return Effect.succeed([])
                    }),
                ),
        ),
    )
}

// TODO: Pending migrate
interface GetRemainingHoursParams {
    classId: string
    /**
     * The day to query in epoch milliseconds
     */
    day: number
}
export async function getRemainingHours({
    classId,
    day,
}: GetRemainingHoursParams) {
    // Convertir timestamp a fecha en zona horaria local (America/Monterrey)
    const dayDate =
        Temporal.Instant.fromEpochMilliseconds(day).toZonedDateTimeISO(
            'America/Monterrey',
        )

    // Obtener el inicio del domingo de esa semana (semana empieza en domingo)
    const startOfWeek = getStartOfWeek(dayDate)
    const endOfWeek = startOfWeek.add({ days: 7 })

    // Obtener clase y subject
    const classData = await db.class.findUnique({
        where: { id: classId },
        select: {
            subject: {
                select: {
                    practice_hours: true,
                },
            },
        },
    })

    if (!classData?.subject?.practice_hours) {
        throw new Error('Clase o subject inválido')
    }

    const allowedHours = classData.subject.practice_hours

    // Consultar prácticas dentro del rango de la semana
    const practices = await db.reservation.findMany({
        where: {
            class_id: classId,
            starts_at: {
                gte: startOfWeek.toInstant().toString(),
                lte: endOfWeek.toInstant().toString(),
            },
        },
        select: {
            starts_at: true,
            ends_at: true,
        },
    })

    // Calcular duración total
    const usedHours = practices.reduce((total, p) => {
        const start = Temporal.Instant.fromEpochMilliseconds(
            p.starts_at.getTime(),
        )
        const end = Temporal.Instant.fromEpochMilliseconds(p.ends_at.getTime())
        const duration = end.since(start, { largestUnit: 'hours' })
        return total + duration.total({ unit: 'hour' })
    }, 0)

    const leftHours = Math.max(allowedHours - usedHours, 0)

    return {
        leftHours: Math.floor(leftHours),
        allowedHours,
        usedHours,
    }
}
