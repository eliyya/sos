'use server'

import { DEFAULT_ROLES } from '@/constants/client'
import { db } from '@/prisma/db'

export async function getAdminRole() {
    const role = await db.role.findFirst({
        where: { name: DEFAULT_ROLES.ADMIN },
    })
    return role!
}

export async function getUserRole() {
    const role = await db.role.findFirst({
        where: { name: DEFAULT_ROLES.USER },
    })
    return role!
}

export async function getDeletedRole() {
    const role = await db.role.findFirst({
        where: { name: DEFAULT_ROLES.DELETED },
    })
    return role!
}

export async function getRoles() {
    const roles = await db.role.findMany()
    return roles
}
