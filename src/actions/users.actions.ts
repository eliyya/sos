'use server'

import { Effect } from 'effect'
import { PrismaLive } from '@/layers/db.layer'
import {
    archiveUserEffect,
    checkIfUsernameIsTakenEffect,
    createUserEffect,
    deleteUserEffect,
    editUserEffect,
    getUsersEffect,
    scheduleUserInformationEffect,
    unarchiveUserEffect,
} from '@/services/users.service'
import {
    BetterAuthAPIError,
    BetterError,
    InvalidInputError,
    NotAllowedError,
    NotFoundError,
    PermissionError,
    PrismaError,
    UnauthorizedError,
    UnexpectedError,
} from '@/errors'
import { AuthLive } from '@/layers/auth.layer'
import { SuccessOf } from '@/lib/type-utils'

export async function getUsersAction() {
    return Effect.runPromise(
        Effect.scoped(
            getUsersEffect()
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.match({
                        onSuccess(value) {
                            return value
                        },
                        onFailure(error) {
                            console.error(error)
                            return []
                        },
                    }),
                ),
        ),
    )
}
type ScheduleUserInformationActionProps = Parameters<
    typeof scheduleUserInformationEffect
>[0]
export async function scheduleUserInformationAction(
    data: ScheduleUserInformationActionProps,
) {
    return Effect.runPromise(
        Effect.scoped(
            scheduleUserInformationEffect(data)
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.match({
                        onSuccess(value) {
                            return value
                        },
                        onFailure(error) {
                            console.error(error)
                            return null
                        },
                    }),
                ),
        ),
    )
}

export async function usernameIsTakenAction(username: string) {
    return Effect.runPromise(
        Effect.scoped(
            checkIfUsernameIsTakenEffect(username)
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.match({
                        onSuccess(value) {
                            if (value.status === 'available') {
                                return {
                                    status: 'success' as const,
                                    type: 'available' as const,
                                }
                            }
                            if (value.status === 'archived') {
                                return {
                                    status: 'success' as const,
                                    type: 'archived' as const,
                                    user: value.user,
                                }
                            }
                            return {
                                status: 'success' as const,
                                type: 'taken' as const,
                                user: value.user,
                            }
                        },
                        onFailure(error) {
                            console.error(error)
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

export async function archiveUserAction(id: string) {
    return Effect.runPromise(
        Effect.scoped(
            archiveUserEffect(id)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess(value) {
                            return {
                                status: 'success' as const,
                                user: value,
                            }
                        },
                        onFailure(error) {
                            if (error instanceof NotAllowedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'not-allowed' as const,
                                    message: error.message,
                                }
                            }
                            if (error instanceof NotFoundError) {
                                return {
                                    status: 'error' as const,
                                    type: 'not-found' as const,
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
                            if (error instanceof UnauthorizedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: error.message,
                                }
                            }
                            console.error(error)
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

export async function unarchiveUserAction(id: string) {
    return Effect.runPromise(
        Effect.scoped(
            unarchiveUserEffect(id)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess(value) {
                            return {
                                status: 'success' as const,
                                user: value,
                            }
                        },
                        onFailure(error) {
                            if (error instanceof NotFoundError) {
                                return {
                                    status: 'error' as const,
                                    type: 'not-found' as const,
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
                            if (error instanceof UnauthorizedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: error.message,
                                }
                            }
                            console.error(error)
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

export async function deleteUserAction(id: string) {
    return Effect.runPromise(
        Effect.scoped(
            deleteUserEffect(id)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess() {
                            return {
                                status: 'success' as const,
                            }
                        },
                        onFailure(error) {
                            if (error instanceof NotFoundError) {
                                return {
                                    status: 'error' as const,
                                    type: 'not-found' as const,
                                    message: error.message,
                                }
                            }
                            if (error instanceof NotAllowedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'not-allowed' as const,
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
                            if (error instanceof UnauthorizedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: error.message,
                                }
                            }
                            console.error(error)
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

// TODO: CatchTag Prisma https://effect.website/docs/error-management/expected-errors/#catchtag
interface EditUserProps {
    id: string
    name: string
    username: string
    role_id: string
    password?: string
}
export async function editUserAction({
    id,
    name,
    username,
    role_id,
    password,
}: Partial<EditUserProps>) {
    return Effect.runPromise(
        Effect.scoped(
            editUserEffect({ id, name, username, role_id, password })
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess(value) {
                            return {
                                status: 'success' as const,
                                user: value,
                            }
                        },
                        onFailure(error) {
                            if (error instanceof NotFoundError) {
                                return {
                                    status: 'error' as const,
                                    type: 'not-found' as const,
                                    message: error.message,
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
                            if (error instanceof PermissionError) {
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: error.message,
                                    missings: error.missings,
                                } as const
                            }
                            if (error instanceof PrismaError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                } as const
                            }
                            if (error instanceof UnauthorizedError) {
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: error.message,
                                }
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

export async function createUserAction({
    password,
    name,
    username,
    role_id,
}: {
    password: string
    name: string
    username: string
    role_id: string
}) {
    return Effect.runPromise(
        Effect.scoped(
            createUserEffect({ password, name, username, role_id })
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess(value) {
                            return {
                                status: 'success' as const,
                                data: value,
                            }
                        },
                        onFailure(error) {
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
                            if (error instanceof BetterError) {
                                return {
                                    status: 'error' as const,
                                    type: 'better-error' as const,
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
                            if (error instanceof BetterAuthAPIError) {
                                return {
                                    status: 'error' as const,
                                    type: 'api-error' as const,
                                    cause: error.cause,
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
