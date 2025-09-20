'use server'

import { Effect } from 'effect'

import { DEFAULT_PERMISSIONS, DEFAULT_ROLES } from '@/constants/client'
import {
    AlreadyArchivedError,
    AlreadyExistsError,
    InvalidInputError,
    NotFoundError,
    UnexpectedError,
} from '@/errors'
import { db, PrismaLive } from '@/prisma/db'
import { editRoleNameEffect } from '@/services/roles-services'

export async function getAdminRole() {
    const role = await db.role.findUnique({
        where: { name: DEFAULT_ROLES.ADMIN },
    })
    if (role) return role
    const newRole = await db.role.create({
        data: {
            name: DEFAULT_ROLES.ADMIN,
            permissions: DEFAULT_PERMISSIONS.ADMIN,
        },
    })
    return newRole
}

export async function getUserRole() {
    const role = await db.role.findFirst({
        where: { name: DEFAULT_ROLES.USER },
    })
    if (role) return role
    const newRole = await db.role.create({
        data: {
            name: DEFAULT_ROLES.USER,
            permissions: DEFAULT_PERMISSIONS.USER,
        },
    })
    return newRole
}

export async function getDeletedRole() {
    const role = await db.role.findFirst({
        where: { name: DEFAULT_ROLES.DELETED },
    })
    if (role) return role
    const newRole = await db.role.create({
        data: {
            name: DEFAULT_ROLES.DELETED,
            permissions: DEFAULT_PERMISSIONS.DELETED,
        },
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
