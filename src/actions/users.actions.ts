'use server'

import { Effect } from 'effect'
import { PrismaLive } from '@/layers/db.layer'
import {
    archiveUserEffect,
    checkIfUsernameIsTakenEffect,
    deleteUserEffect,
    editUserEffect,
    getUsersEffect,
    unarchiveUserEffect,
} from '@/services/users.service'
import {
    InvalidInputError,
    NotAllowedError,
    NotFoundError,
    PermissionError,
    UnauthorizedError,
} from '@/errors'
import { AuthLive } from '@/layers/auth.layer'

export async function getUsers() {
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

export async function usernameIsTaken(username: string) {
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

export async function archiveUser(id: string) {
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

export async function unarchiveUser(id: string) {
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

export async function deleteUser(id: string) {
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

interface EditUserProps {
    id: string
    name: string
    username: string
    role_id: string
    password?: string
}
export async function editUser({
    id,
    name,
    username,
    role_id,
    password,
}: EditUserProps) {
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
                                }
                            }
                            if (error instanceof InvalidInputError) {
                                return {
                                    status: 'error' as const,
                                    type: 'invalid-input' as const,
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
