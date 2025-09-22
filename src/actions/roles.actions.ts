'use server'

import { Effect } from 'effect'
import {
    AlreadyExistsError,
    InvalidInputError,
    NotFoundError,
    PermissionError,
    UnauthorizedError,
    UnexpectedError,
} from '@/errors'
import {
    changuePermissionsEffect,
    createNewRoleEffect,
    deleteRoleEffect,
    editRoleNameEffect,
    getAdminRoleEffect,
    getRolesEffect,
    usersCountPerRoleEffect,
} from '@/services/roles.service'
import { PrismaLive } from '@/layers/db.layer'
import { SessionLive } from '@/layers/auth.layer'

/**
 * Obtiene el rol ADMIN si existe; de lo contrario lo crea con los permisos por defecto.
 * También actualiza el contador de roles en la tabla de estados.
 */
export async function getAdminRole() {
    return await Effect.runPromise(
        Effect.scoped(
            getAdminRoleEffect()
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

/**
 * Lista todos los roles existentes en la base de datos.
 */
export async function getRoles() {
    return await Effect.runPromise(
        Effect.scoped(
            getRolesEffect()
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

/**
 * Cambia el nombre de un rol.
 * Requiere sesión válida y permisos adecuados; usa efectos para manejar errores tipificados.
 */
export async function editRoleName(id: string, name: string) {
    return await Effect.runPromise(
        Effect.scoped(
            editRoleNameEffect(id, name)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(SessionLive))
                .pipe(
                    Effect.match({
                        onSuccess: role => ({
                            status: 'success' as const,
                            role,
                        }),
                        onFailure: error => {
                            if (error instanceof InvalidInputError)
                                return {
                                    status: 'error' as const,
                                    type: 'invalid-input' as const,
                                    message: error.message,
                                }
                            if (error instanceof NotFoundError)
                                return {
                                    status: 'error' as const,
                                    type: 'not-found' as const,
                                    message: error.message,
                                }
                            if (error instanceof UnexpectedError)
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                }
                            if (error instanceof AlreadyExistsError) {
                                return {
                                    status: 'error' as const,
                                    type: 'already-exists' as const,
                                    message: error.message,
                                }
                            }
                            if (error instanceof UnauthorizedError)
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: error.message,
                                }
                            if (error instanceof PermissionError)
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: error.message,
                                }
                            return {
                                status: 'error' as const,
                                type: 'unknown' as const,
                                message: String(error),
                            }
                        },
                    }),
                ),
        ),
    )
}

/**
 * Crea un nuevo rol con valores por defecto.
 * Requiere sesión válida y permisos adecuados.
 */
export async function createNewRole() {
    return await Effect.runPromise(
        Effect.scoped(
            createNewRoleEffect()
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(SessionLive))
                .pipe(
                    Effect.match({
                        onSuccess: role => ({
                            status: 'success' as const,
                            role,
                        }),
                        onFailure: error => {
                            if (error instanceof UnexpectedError)
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                }
                            if (error instanceof UnauthorizedError)
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: error.message,
                                }
                            if (error instanceof PermissionError)
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: error.message,
                                }
                            return {
                                status: 'error' as const,
                                type: 'unknown' as const,
                                message: String(error),
                            }
                        },
                    }),
                ),
        ),
    )
}

/**
 * Elimina (o desactiva) un rol por ID.
 * Requiere sesión válida y permisos adecuados.
 */
export async function deleteRole(id: string) {
    return await Effect.runPromise(
        Effect.scoped(
            deleteRoleEffect(id)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(SessionLive))
                .pipe(
                    Effect.match({
                        onSuccess: () => ({ status: 'success' as const }),
                        onFailure: error => {
                            if (error instanceof UnexpectedError)
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                }
                            if (error instanceof UnauthorizedError)
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: error.message,
                                }
                            if (error instanceof PermissionError)
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: error.message,
                                }
                            return {
                                status: 'error' as const,
                                type: 'unknown' as const,
                                message: String(error),
                            }
                        },
                    }),
                ),
        ),
    )
}

/**
 * Cambia los permisos de un rol.
 * Requiere sesión válida y permisos adecuados.
 *
 * Nota: los permisos se representan como un bigint (máscara de bits).
 */
export async function changuePermissions(id: string, permissions: bigint) {
    return await Effect.runPromise(
        Effect.scoped(
            changuePermissionsEffect(id, permissions)
                .pipe(Effect.provide(PrismaLive))
                .pipe(Effect.provide(SessionLive))
                .pipe(
                    Effect.match({
                        onSuccess: role => ({
                            status: 'success' as const,
                            role,
                        }),
                        onFailure: error => {
                            if (error instanceof UnexpectedError)
                                return {
                                    status: 'error' as const,
                                    type: 'unexpected' as const,
                                    message: String(error.cause),
                                }
                            if (error instanceof NotFoundError)
                                return {
                                    status: 'error' as const,
                                    type: 'not-found' as const,
                                    message: error.message,
                                }
                            if (error instanceof InvalidInputError)
                                return {
                                    status: 'error' as const,
                                    type: 'invalid-input' as const,
                                    message: error.message,
                                }

                            if (error instanceof UnauthorizedError)
                                return {
                                    status: 'error' as const,
                                    type: 'unauthorized' as const,
                                    message: error.message,
                                }
                            if (error instanceof PermissionError)
                                return {
                                    status: 'error' as const,
                                    type: 'permission' as const,
                                    message: error.message,
                                }
                            return {
                                status: 'error' as const,
                                type: 'unknown' as const,
                                message: String(error),
                            }
                        },
                    }),
                ),
        ),
    )
}

/**
 * Obtiene el conteo de usuarios por rol.
 */
export async function getUsersCountPerRole() {
    return await Effect.runPromise(
        Effect.scoped(
            Effect.provide(usersCountPerRoleEffect(), PrismaLive).pipe(
                Effect.match({
                    onSuccess: roles => ({ status: 'success' as const, roles }),
                    onFailure: error => {
                        if (error instanceof UnexpectedError)
                            return {
                                status: 'error' as const,
                                type: 'unexpected' as const,
                                message: String(error.cause),
                            }
                        return {
                            status: 'error' as const,
                            type: 'unknown' as const,
                            message: String(error),
                        }
                    },
                }),
            ),
        ),
    )
}
