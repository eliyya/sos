'use server'

import { db } from '@/prisma/db'
import { Prisma, STATUS } from '@prisma/client'

export async function createSubject(formData: FormData) {
    const name = formData.get('name') as string
    const theory_hours = Number(formData.get('theory_hours') as string)
    const practice_hours = Number(formData.get('practice_hours') as string)

    try {
        await db.subject.create({
            data: {
                name,
                theory_hours,
                practice_hours,
            },
        })
        return { error: null }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') return { error: 'La materia ya existe' }
            console.log(error.meta)
        }
        console.error(error)
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

export async function getSubjectsActive() {
    return await db.subject.findMany({
        where: {
            status: STATUS.ACTIVE,
        },
    })
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
                name: id,
                theory_hours: 0,
                practice_hours: 0,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}
