'use server'

import { Effect } from 'effect'

import {
    DB_STATES,
    DEFAULT_PERMISSIONS,
    DEFAULT_ROLES,
} from '@/constants/client'
import {
    AlreadyExistsError,
    InvalidInputError,
    NotFoundError,
    UnexpectedError,
} from '@/errors'
import { db, PrismaLive } from '@/prisma/db'
import {
    changuePermissionsEffect,
    createNewRoleEffect,
    deleteRoleEffect,
    editRoleNameEffect,
} from '@/services/roles.effect'

export async function getAdminRole() {
    const role = await db.role.findUnique({
        where: { name: DEFAULT_ROLES.ADMIN },
    })
    if (role) return role
    const newRole = await db.$transaction(async t => {
        const role = await t.role.create({
            data: {
                name: DEFAULT_ROLES.ADMIN,
                permissions: DEFAULT_PERMISSIONS.ADMIN,
            },
        })
        await t.states.upsert({
            where: { name: DB_STATES.ROLES_COUNT },
            create: {
                name: DB_STATES.ROLES_COUNT,
                value: 1,
            },
            update: {
                value: {
                    increment: 1,
                },
            },
        })
        return role
    })
    return newRole
}

export async function getUserRole() {
    const role = await db.role.findFirst({
        where: { name: DEFAULT_ROLES.USER },
    })
    if (role) return role
    const newRole = await db.$transaction(async t => {
        const role = await t.role.create({
            data: {
                name: DEFAULT_ROLES.USER,
                permissions: DEFAULT_PERMISSIONS.USER,
            },
        })
        await t.states.upsert({
            where: { name: DB_STATES.ROLES_COUNT },
            create: {
                name: DB_STATES.ROLES_COUNT,
                value: 2,
            },
            update: {
                value: {
                    increment: 1,
                },
            },
        })
        return role
    })
    return newRole
}

export async function getDeletedRole() {
    const role = await db.role.findFirst({
        where: { name: DEFAULT_ROLES.DELETED },
    })
    if (role) return role
    const newRole = await db.$transaction(async t => {
        const role = await t.role.create({
            data: {
                name: DEFAULT_ROLES.DELETED,
                permissions: DEFAULT_PERMISSIONS.DELETED,
            },
        })
        await t.states.upsert({
            where: { name: DB_STATES.ROLES_COUNT },
            create: {
                name: DB_STATES.ROLES_COUNT,
                value: 3,
            },
            update: {
                value: {
                    increment: 1,
                },
            },
        })
        return role
    })
    return newRole
}

export async function getRoles() {
    const roles = await db.role.findMany()
    return roles
}

export async function editRoleName(id: string, name: string) {
    return await Effect.runPromise(
        Effect.scoped(
            Effect.provide(editRoleNameEffect(id, name), PrismaLive).pipe(
                Effect.match({
                    onSuccess: role => ({ status: 'success' as const, role }),
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

export async function createNewRole() {
    return await Effect.runPromise(
        Effect.scoped(
            Effect.provide(createNewRoleEffect(), PrismaLive).pipe(
                Effect.match({
                    onSuccess: role => ({ status: 'success' as const, role }),
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

export async function deleteRole(id: string) {
    return await Effect.runPromise(
        Effect.scoped(
            Effect.provide(deleteRoleEffect(id), PrismaLive).pipe(
                Effect.match({
                    onSuccess: () => ({ status: 'success' as const }),
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

export async function changuePermissions(id: string, permissions: bigint) {
    return await Effect.runPromise(
        Effect.scoped(
            Effect.provide(
                changuePermissionsEffect(id, permissions),
                PrismaLive,
            ).pipe(
                Effect.match({
                    onSuccess: role => ({ status: 'success' as const, role }),
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
