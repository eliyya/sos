'use server'

import { Effect } from 'effect'
import {
    archiveCareerEffect,
    createCareerEffect,
    deleteCareerEffect,
    editCareerEffect,
    getCareersEffect,
    searchCareersEffect,
    unarchiveCareerEffect,
} from '@/services/careers.service'
import { PrismaLive } from '@/layers/db.layer'
import { AuthLive } from '@/layers/auth.layer'
import {
    AlreadyArchivedError,
    InvalidInputError,
    NotFoundError,
    PermissionError,
    PrismaError,
    UnauthorizedError,
    UnexpectedError,
} from '@/errors'
import { SuccessOf } from '@/lib/type-utils'

type CreateCareerProps = Parameters<typeof createCareerEffect>[0]
export async function createCareer(props: CreateCareerProps) {
    return await Effect.runPromise(
        Effect.scoped(
            createCareerEffect(props)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: career => ({
                            status: 'success' as const,
                            career,
                        }),
                        onFailure: error => {
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
                                    id: error.id,
                                } as const
                            }
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
                            if (error instanceof PermissionError) {
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: error.message,
                                    missings: error.missings,
                                } as const
                            }
                            if (error instanceof UnexpectedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
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

type EditCareerProps = Parameters<typeof editCareerEffect>[0]
export async function editCareer(props: EditCareerProps) {
    return await Effect.runPromise(
        Effect.scoped(
            editCareerEffect(props)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: career => ({
                            status: 'success' as const,
                            career,
                        }),
                        onFailure: error => {
                            if (error instanceof NotFoundError) {
                                return {
                                    status: 'error' as const,
                                    type: 'not-found' as const,
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
                            if (error instanceof PermissionError) {
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: error.message,
                                    missings: error.missings,
                                } as const
                            }
                            if (error instanceof UnexpectedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
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

export async function archiveCareer(id: string) {
    return await Effect.runPromise(
        Effect.scoped(
            archiveCareerEffect(id)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: career => ({
                            status: 'success' as const,
                            career,
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

export async function unarchiveCareer(id: string) {
    return await Effect.runPromise(
        Effect.scoped(
            unarchiveCareerEffect(id)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: career => ({
                            status: 'success' as const,
                            career,
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

export async function deleteCareer(id: string) {
    return await Effect.runPromise(
        Effect.scoped(
            deleteCareerEffect(id)
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

export async function getCareers() {
    return await Effect.runPromise(
        Effect.scoped(
            getCareersEffect()
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

type SearchCareersProps = Parameters<typeof searchCareersEffect>[0]
export async function searchCareers(
    props: SearchCareersProps,
): Promise<SuccessOf<ReturnType<typeof searchCareersEffect>>> {
    return await Effect.runPromise(
        Effect.scoped(
            searchCareersEffect(props)
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.catchAll(error => {
                        console.log(error)
                        return Effect.succeed({ careers: [], count: 0 })
                    }),
                ),
        ),
    )
}
