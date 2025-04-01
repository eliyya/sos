'use server'

import { db, snowflake } from '@/lib/db'
import { STATUS } from '@prisma/client'

export async function createCareer(formData: FormData) {
    const name = formData.get('name') as string

    try {
        await db.career.create({
            data: {
                id: snowflake.generate(),
                name,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Error al crear la materia, intente nuevamente.' }
    }
}

export async function editCareer(formData: FormData) {
    const id = formData.get('id') as string
    const name = formData.get('name') as string

    try {
        await db.career.update({
            where: {
                id,
            },
            data: {
                name,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Ocurrio un error, intente nuevamente.' }
    }
}

export async function getCareers() {
    return await db.career.findMany()
}

export async function archiveCareer(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.career.update({
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
export async function unarchiveCareer(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.career.update({
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

export async function deleteCareer(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.career.update({
            where: {
                id,
            },
            data: {
                status: STATUS.DELETED,
                name: id,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}
