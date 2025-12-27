'use server'

import { PrismaLive } from '@/layers/db.layer'
import { SuccessOf } from '@/lib/type-utils'
import {
    getPracticesFromWeekEffect,
    getReservationEffect,
    reserveLaboratoryEffect,
} from '@/services/reservations.service'
import { Effect } from 'effect'
import { AuthLive } from '@/layers/auth.layer'
import {
    InvalidInputError,
    PermissionError,
    PrismaError,
    UnauthorizedError,
    UnexpectedError,
} from '@/errors'
import { ZodError } from 'zod'

export async function getReservationAction({
    id,
}: {
    id: string
}): Promise<SuccessOf<ReturnType<typeof getReservationEffect>>> {
    return await Effect.runPromise(
        Effect.scoped(
            getReservationEffect({ id })
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.catchAll(error => {
                        console.log(error)
                        return Effect.succeed(null)
                    }),
                ),
        ),
    )
}

export async function getPracticesFromWeekAction({
    lab_id,
    timestamp,
}: {
    lab_id: string
    timestamp: number
}): Promise<SuccessOf<ReturnType<typeof getPracticesFromWeekEffect>>> {
    return await Effect.runPromise(
        Effect.scoped(
            getPracticesFromWeekEffect({ lab_id, timestamp })
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

type reserveLaboratoryProps = Parameters<typeof reserveLaboratoryEffect>[0]
export async function reserveLaboratoryAction(data: reserveLaboratoryProps) {
    return await Effect.runPromise(
        Effect.scoped(
            reserveLaboratoryEffect(data)
                .pipe(Effect.provide([PrismaLive, AuthLive]))
                .pipe(
                    Effect.match({
                        onSuccess: reservation => ({
                            status: 'succed',
                            reservation,
                        }),
                        onFailure: error => {
                            if (error instanceof InvalidInputError) {
                                return {
                                    status: 'error',
                                    type: 'invalid-input',
                                    field: error.field,
                                    message: error.message,
                                } as const
                            }
                            if (error instanceof ZodError) {
                                const [issue] = error.issues
                                return {
                                    status: 'error',
                                    type: 'invalid-input',
                                    field: issue
                                        .path[0] as keyof reserveLaboratoryProps,
                                    message: error.message,
                                } as const
                            }
                            if (error instanceof UnauthorizedError) {
                                return {
                                    status: 'error',
                                    type: 'unauthorized',
                                    message: error.message,
                                } as const
                            }
                            if (error instanceof PermissionError) {
                                return {
                                    status: 'error',
                                    type: 'permissions',
                                    message: error.message,
                                    missings: error.missings,
                                } as const
                            }
                            if (error instanceof PrismaError) {
                                return {
                                    status: 'error',
                                    type: 'unexpected',
                                } as const
                            }
                            if (error instanceof UnexpectedError) {
                                return {
                                    status: 'error',
                                    type: 'unexpected',
                                } as const
                            }
                            return {
                                status: 'error',
                                type: 'unexpected',
                            } as const
                        },
                    }),
                ),
        ),
    )
}
