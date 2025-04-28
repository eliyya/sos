'use server'

import { db, snowflake } from '@/lib/db'
import { STATUS } from '@prisma/client'

export async function createlab(formData: FormData) {
    const name = formData.get('name') as string
    const type = formData.get('teacher_id') as string
    const  = formData.get('career_id') as string
    console.log({ subject_id, teacher_id, career_id })

    try {
        await db.class.create({
            data: {
                id: snowflake.generate(),
                name,
                type,
                teacher_id,
                career_id,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Error al crear la materia, intente nuevamente.' }
    }
}

export async function editClass(formData: FormData) {
    const id = formData.get('id') as string
    const subject_id = formData.get('subject_id') as string
    const teacher_id = formData.get('teacher_id') as string
    const career_id = formData.get('career_id') as string

    try {
        await db.class.update({
            where: {
                id,
            },
            data: {
                subject_id,
                teacher_id,
                career_id,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Ocurrio un error, intente nuevamente.' }
    }
}

export async function getClasses() {
    return await db.class.findMany()
}

export async function getActiveClassesWithData() {
    return await db.class.findMany({
        where: {
            status: STATUS.ACTIVE,
        },
        include: {
            subject: true,
            teacher: true,
            career: true,
        },
    })
}
export async function getDisponibleClassesWithData() {
    return await db.class.findMany({
        where: {
            status: {
                not: STATUS.DELETED,
            },
        },
        include: {
            subject: true,
            teacher: true,
            career: true,
        },
    })
}

export async function archiveClass(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.class.update({
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
export async function unarchiveClass(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.class.update({
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

export async function deleteClass(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.class.update({
            where: {
                id,
            },
            data: {
                status: STATUS.DELETED,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}
