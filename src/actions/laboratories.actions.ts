'use server'

import {
    PERMISSIONS_FLAGS,
    PermissionsBitField,
} from '@/bitfields/PermissionsBitField'
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
import { auth } from '@/lib/auth'
import { db } from '@/prisma/db'
import {
    archiveLaboratoryEffect,
    createLaboratoryEffect,
    deleteLaboratoryEffect,
    editLaboratoryEffect,
    getLaboratoriesEffect,
    unarchiveLaboratoryEffect,
} from '@/services/laboratories.service'
import { Temporal } from '@js-temporal/polyfill'
import { Effect } from 'effect'
import { headers } from 'next/headers'

export async function createLaboratory({
    close_hour,
    name,
    open_hour,
    type,
}: Parameters<typeof createLaboratoryEffect>[0]) {
    return await Effect.runPromise(
        Effect.scoped(
            createLaboratoryEffect({ close_hour, name, open_hour, type })
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: laboratory => ({
                            status: 'success' as const,
                            laboratory,
                        }),
                        onFailure: error => {
                            if (error instanceof InvalidInputError) {
                                return {
                                    status: 'error' as const,
                                    type: 'invalid-input' as const,
                                    message: error.message,
                                    field: error.input,
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
                                    id: error.id,
                                } as const
                            }
                            if (error instanceof AlreadyExistsError) {
                                return {
                                    status: 'error' as const,
                                    type: 'already-exists' as const,
                                    message: error.message,
                                    id: error.id,
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

export async function editLaboratory({
    close_hour,
    name,
    open_hour,
    type,
}: Parameters<typeof editLaboratoryEffect>[0]) {
    return await Effect.runPromise(
        Effect.scoped(
            editLaboratoryEffect({ close_hour, name, open_hour, type })
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: laboratory => ({
                            status: 'success' as const,
                            laboratory,
                        }),
                        onFailure: error => {
                            if (error instanceof InvalidInputError) {
                                return {
                                    status: 'error' as const,
                                    type: 'invalid-input' as const,
                                    message: error.message,
                                    field: error.input,
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
                            if (error instanceof AlreadyExistsError) {
                                return {
                                    status: 'error' as const,
                                    type: 'already-exists' as const,
                                    message: error.message,
                                    id: error.id,
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

export async function deleteLaboratory(id: string) {
    return await Effect.runPromise(
        Effect.scoped(
            deleteLaboratoryEffect(id)
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

export async function archiveLaboratory(id: string) {
    return await Effect.runPromise(
        Effect.scoped(
            archiveLaboratoryEffect(id)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: laboratory => ({
                            status: 'success' as const,
                            laboratory,
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

export async function unarchiveLaboratory(id: string) {
    return await Effect.runPromise(
        Effect.scoped(
            unarchiveLaboratoryEffect(id)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(AuthLive))
                .pipe(
                    Effect.match({
                        onSuccess: laboratory => ({
                            status: 'success' as const,
                            laboratory,
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

export async function getLaboratories() {
    return await Effect.runPromise(
        Effect.scoped(
            getLaboratoriesEffect()
                .pipe(Effect.provide(PrismaLive))
                .pipe(
                    Effect.match({
                        onSuccess: laboratories => laboratories,
                        onFailure: error => {
                            console.log(error)
                            return []
                        },
                    }),
                ),
        ),
    )
}

// TODO: Pending migrate
export async function setAsideLaboratory(formData: FormData): Promise<{
    message: string | null
    errors: { class_id?: string; teacher_id?: string }
}> {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session) return { message: 'No tienes acceso', errors: {} }
    const permissions = new PermissionsBitField(
        BigInt(session.user.permissions),
    )
    const teacher_id = formData.get('teacher_id') as string
    let class_id: string | null = formData.get('class_id') as string
    const laboratory_id = formData.get('laboratory_id') as string
    const name = formData.get('name') as string
    const topic = formData.get('topic') as string
    const time = formData.get('time') as string
    const password = formData.get('password') as string
    const students = formData.get('students') as string
    const starts_at = Temporal.Instant.fromEpochMilliseconds(
        parseInt(formData.get('starts_at') as string),
    )
    const ends_at = starts_at.add({ hours: parseInt(time) })
    if (!permissions.has(PERMISSIONS_FLAGS.MANAGE_LABS) && !class_id)
        return {
            message: 'Faltan datos',
            errors: { class_id: 'Este campo es requerido' },
        }
    class_id ||= null
    let registered_by = teacher_id
    const authContext = await auth.$context
    const teacher = await db.account.findFirst({
        where: { user_id: teacher_id },
        select: { password: true },
    })
    if (!teacher) return { message: 'El usuario no existe', errors: {} }
    let passVerified = authContext.password.verify({
        password,
        hash: teacher.password ?? '',
    })
    if (!passVerified) {
        if (
            permissions.has(PERMISSIONS_FLAGS.MANAGE_LABS) &&
            teacher_id !== session.user.id
        ) {
            const user = await db.account.findFirst({
                where: { user_id: teacher_id },
                select: { password: true },
            })
            if (!user) return { message: 'El usuario no existe', errors: {} }
            passVerified = authContext.password.verify({
                password,
                hash: user.password ?? '',
            })
            registered_by = session.user.id
            if (!passVerified)
                return {
                    message: 'La contraseña es incorrecta',
                    errors: { teacher_id: 'La contraseña es incorrecta' },
                }
        } else
            return {
                message: 'La contraseña es incorrecta',
                errors: { teacher_id: 'La contraseña es incorrecta' },
            }
    }
    await db.practice.create({
        data: {
            topic,
            name,
            students: parseInt(students),
            teacher_id,
            class_id,
            laboratory_id,
            registered_by,
            starts_at: new Date(starts_at.epochMilliseconds),
            ends_at: new Date(ends_at.epochMilliseconds),
        },
    })
    return { message: null, errors: {} }
}
