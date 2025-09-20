'use server'

import { DEFAULT_PERMISSIONS, DEFAULT_ROLES } from '@/constants/client'
import { db } from '@/prisma/db'

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
