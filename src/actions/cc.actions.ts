'use server'

import { Effect } from 'effect'
import {
    endVisitEffect,
    getTodayVisitsEffect,
    registerVisitEffect,
} from '@/services/cc.service'
import { PrismaLive } from '@/layers/db.layer'
import { AuthLive } from '@/layers/auth.layer'
import {
    AlreadyArchivedError,
    AlreadyExistsError,
    InvalidInputError,
    PermissionError,
    PrismaError,
    UnauthorizedError,
    UnexpectedError,
} from '@/errors'
import { SuccessOf } from '@/lib/type-utils'

export async function registerVisitAction(data: {
    student_nc: string
    laboratory_id: string
    career_id?: string
    firstname?: string
    lastname?: string
    group?: number
    semester?: number
}) {
    return await Effect.runPromise(
        Effect.scoped(
            registerVisitEffect(data)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess(value) {
                            return { status: 'success' as const, visit: value }
                        },
                        onFailure(error) {
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
                            console.log(error.cause);
                            
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
interface getVisitsTodayProps {
    laboratory_id: string
}
export async function getTodayVisitsAction({
    laboratory_id,
}: getVisitsTodayProps): Promise<
    SuccessOf<ReturnType<typeof getTodayVisitsEffect>>
> {
    return await Effect.runPromise(
        Effect.scoped(
            getTodayVisitsEffect({ laboratory_id })
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

interface endVisitProps {
    id: string
}
export async function finishVisitAction({ id }: endVisitProps) {
    return await Effect.runPromise(
        Effect.scoped(
            endVisitEffect({ id })
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess(value) {
                            return {
                                status: 'success' as const,
                                data: value,
                            } as const
                        },
                        onFailure(error) {
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
