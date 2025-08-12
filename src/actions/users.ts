'use server'

import { db } from '@/prisma/db'
import { STATUS } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { getUserRole } from './roles'
import { capitalize } from '@/lib/utils'

export async function getUsers() {
    return db.user.findMany({
        where: { status: { not: STATUS.DELETED } },
    })
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
    const userRole = await getUserRole()
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
    // TODO: Update password
    try {
        await db.user.update({
            where: { id },
            data: { name, username, role_id },
        })
        return { error: null }
    } catch (error) {
        console.log(error)
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}
