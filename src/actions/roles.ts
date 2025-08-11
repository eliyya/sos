'use server'

import { db } from '@/prisma/db'

export async function getAdminRole() {
    const role = await db.role.findFirst({
        where: { name: 'admin' },
    })
    return role!
}

export async function getUserRole() {
    const role = await db.role.findFirst({
        where: { name: 'user' },
    })
    return role!
}

export async function getRoles() {
    const roles = await db.role.findMany()
    return roles
}
