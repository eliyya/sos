'use server'

import { db, snowflake } from '@/lib/db'
import { STATUS } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export async function createSubject(formData: FormData) {
    const name = formData.get('name') as string
    const theory_hours = Number(formData.get('theory_hours') as string)
    const practice_hours = Number(formData.get('practice_hours') as string)

    try {
        await db.subject.create({
            data: {
                id: snowflake.generate(),
                name,
                theory_hours,
                practice_hours,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Error al crear la materia, intente nuevamente.' }
    }
}

export async function editSubject(formData: FormData) {
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const theory_hours = Number(formData.get('theory_hours') as string)
    const practice_hours = Number(formData.get('practice_hours') as string)

    try {
        await db.subject.update({
            where: {
                id,
            },
            data: {
                name,
                theory_hours,
                practice_hours,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Ocurrio un error, intente nuevamente.' }
    }
}

export async function getSubjects() {
    return await db.subject.findMany()
}

export async function archiveSubject(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.subject.update({
            where: {
                id,
            },
            data: {
                status: STATUS.ARCHIVED,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}
export async function unarchiveSubject(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.subject.update({
            where: {
                id,
            },
            data: {
                status: STATUS.ACTIVE,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}

export async function deleteSubject(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.subject.update({
            where: {
                id,
            },
            data: {
                status: STATUS.DELETED,
                name: randomUUID().replace(/-/g, ''),
                theory_hours: 0,
                practice_hours: 0,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}
