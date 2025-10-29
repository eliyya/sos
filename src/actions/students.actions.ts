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
import {
    archiveStudentEffect,
    createStudentEffect,
    deleteStudentEffect,
    editStudentEffect,
    getStudentsEffect,
    searchStudentsEffect,
    unarchiveStudentEffect,
} from '@/services/students.service'
import { Effect } from 'effect'

export async function createStudent({
    career_id,
    firstname,
    lastname,
    nc,
    group,
    semester,
}: Parameters<typeof createStudentEffect>[0]) {
    return await Effect.runPromise(
        Effect.scoped(
            createStudentEffect({
                career_id,
                firstname,
                lastname,
                nc,
                group,
                semester,
            })
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: student => ({
                            status: 'success' as const,
                            student,
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

export async function editStudent({
    career_id,
    firstname,
    lastname,
    nc,
    group,
    semester,
}: Parameters<typeof editStudentEffect>[0]) {
    return await Effect.runPromise(
        Effect.scoped(
            editStudentEffect({
                career_id,
                firstname,
                lastname,
                nc,
                group,
                semester,
            })
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: student => ({
                            status: 'success' as const,
                            student,
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

export async function deleteStudent(nc: string) {
    return await Effect.runPromise(
        Effect.scoped(
            deleteStudentEffect(nc)
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

export async function archiveStudent(nc: string) {
    return await Effect.runPromise(
        Effect.scoped(
            archiveStudentEffect(nc)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: student => ({
                            status: 'success' as const,
                            student,
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

export async function unarchiveStudent(nc: string) {
    return await Effect.runPromise(
        Effect.scoped(
            unarchiveStudentEffect(nc)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: student => ({
                            status: 'success' as const,
                            student,
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

export async function getStudents() {
    return await Effect.runPromise(
        Effect.scoped(
            getStudentsEffect()
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.match({
                        onSuccess: students => students,
                        onFailure: error => {
                            console.log(error)
                            return []
                        },
                    }),
                ),
        ),
    )
}

type SearchStudentsProps = Parameters<typeof searchStudentsEffect>[0]
export async function searchStudents(props: SearchStudentsProps) {
    return await Effect.runPromise(
        Effect.scoped(
            searchStudentsEffect(props)
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.match({
                        onSuccess: students => students,
                        onFailure: error => {
                            console.log(error)
                            return []
                        },
                    }),
                ),
        ),
    )
}
