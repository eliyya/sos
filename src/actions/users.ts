'use server'

import { randomUUID } from 'node:crypto'
import { STATUS, User } from '@prisma/client'
import { auth } from '@/lib/auth'
import { capitalize } from '@/lib/utils'
import { db } from '@/prisma/db'
import { getAdminRole, getDeletedRole } from './roles.actions'

export async function getUsers() {
    return db.user.findMany({
        where: { status: { not: STATUS.DELETED } },
    })
}

export async function usernameIsTaken(
    username: string,
): Promise<
    | { status: 'archived' | 'taken'; user: User }
    | { status: 'available'; user: null }
> {
    const user = await db.user.findFirst({ where: { username } })
    if (!user) return { status: 'available', user }
    if (user.status === STATUS.ARCHIVED) return { status: 'archived', user }
    return { status: 'taken', user }
}

export async function getTeachersActive() {
    return db.user.findMany({ where: { status: STATUS.ACTIVE } })
}

export async function archiveUser(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.user.update({
            where: { id },
            data: { status: STATUS.ARCHIVED },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}

export async function adminCount() {
    const adminRole = await getAdminRole()
    return db.user.count({ where: { role_id: adminRole.id } })
}

export async function unarchiveUser(formData: FormData) {
    const id = formData.get('id') as string
    try {
        const user = await db.user.findFirst({
            where: { id },
            select: { status: true },
        })
        if (user && user.status === STATUS.DELETED)
            return { error: 'Usuario eliminado, no se puede recuperar' }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
    try {
        await db.user.update({
            where: { id },
            data: { status: STATUS.ACTIVE },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}

export async function deleteUser(formData: FormData) {
    const id = formData.get('user_id') as string
    const userRole = await getDeletedRole()
    try {
        await db.user.update({
            where: { id },
            data: {
                status: STATUS.DELETED,
                name: randomUUID().replace(/-/g, ''),
                username: randomUUID().replace(/-/g, ''),
                role_id: userRole.id,
            },
        })
        await db.session.deleteMany({
            where: { user_id: id },
        })
        await db.account.updateMany({
            where: { user_id: id },
            data: { password: randomUUID().replace(/-/g, '') },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}

export async function editUser(formData: FormData) {
    const id = formData.get('user_id') as string
    const name = capitalize((formData.get('name') as string).trim())
    const username = (formData.get('username') as string).trim()
    const role_id = formData.get('role_id') as string
    const password = formData.get('password') as string
    const ctx = await auth.$context

    try {
        await db.user.update({
            where: { id },
            data: { name, username, role_id },
        })
        await db.account.updateMany({
            where: { user_id: id },
            data: { password: await ctx.password.hash(password) },
        })
        await db.session.deleteMany({ where: { user_id: id } })
        return { error: null }
    } catch (error) {
        console.log(error)
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}
