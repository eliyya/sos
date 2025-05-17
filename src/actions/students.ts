'use server'

import { db } from '@/prisma/db'
import { STATUS } from '@prisma/client'

export async function getStudents() {
    return db.student.findMany({
        where: {
            status: {
                not: STATUS.DELETED,
            },
        },
    })
}

export async function findStudent(nc: string) {
    return db.student.findFirst({ where: { nc }, include: { career: true } })
}

export async function getStudentsWithCareer() {
    return db.student.findMany({
        where: {
            status: {
                not: STATUS.DELETED,
            },
        },
        include: {
            career: true,
        },
    })
}

export async function getStudentsActive() {
    return db.student.findMany({
        where: {
            status: STATUS.ACTIVE,
        },
    })
}

export async function editStudent(formData: FormData) {
    const lastname = formData.get('lastname') as string
    const firstname = formData.get('firstname') as string
    const nc = formData.get('nc') as string
    const semester = parseInt(formData.get('semester') as string)
    const career_id = formData.get('carrer_id') as string

    try {
        await db.student.update({
            where: {
                nc,
            },
            data: {
                lastname,
                firstname,
                semester,
                career_id,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal' }
    }
}

export async function archiveStudent(formData: FormData) {
    const nc = formData.get('nc') as string
    try {
        await db.student.update({
            where: {
                nc,
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

export async function unarchiveStudent(formData: FormData) {
    const nc = formData.get('nc') as string
    try {
        const user = await db.student.findFirst({
            where: {
                nc,
            },
            select: {
                status: true,
            },
        })
        if (user && user.status === STATUS.DELETED)
            return { error: 'Usuario eliminado, no se puede recuperar' }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
    try {
        await db.student.update({
            where: {
                nc,
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

export async function deleteStudent(formData: FormData) {
    const nc = formData.get('nc') as string
    try {
        await db.student.update({
            where: {
                nc,
            },
            data: {
                status: STATUS.DELETED,
                lastname: nc,
                firstname: nc,
                semester: -1,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}

export async function createStudent(formData: FormData) {
    const lastname = formData.get('lastname') as string
    const firstname = formData.get('firstname') as string
    const nc = formData.get('nc') as string
    const semester = parseInt(formData.get('semester') as string)
    const career_id = formData.get('career_id') as string
    console.log({ lastname, firstname, semester, career_id, nc })

    if (!lastname || !firstname || !semester || !career_id || !nc)
        return { error: 'Falta algun dato' }

    try {
        await db.student.create({
            data: {
                nc,
                lastname,
                firstname,
                semester,
                career_id,
            },
        })
        return {}
    } catch {
        return { error: 'Algo sucedió, intenta más tarde' }
    }
}
// TODO: check role
