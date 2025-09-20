'use server'

import { Career, Prisma, STATUS } from '@prisma/client'

import { db } from '@/prisma/db'

export async function createCareer(formData: FormData): Promise<
    | {
          error:
              | 'La carrera ya existe'
              | 'Error al crear la carrera, intente nuevamente.'
              | null
          career: null
      }
    | {
          error: 'La carrera esta archivada'
          career: Career
      }
> {
    const name = formData.get('name') as string
    const alias = formData.get('alias') as string

    const career = await db.career.findUnique({
        where: {
            name,
        },
    })
    if (career?.status === STATUS.ARCHIVED)
        return { error: 'La carrera esta archivada', career }
    try {
        await db.career.create({
            data: {
                name,
                alias,
            },
        })
        return { error: null, career: null }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002')
                return { error: 'La carrera ya existe', career: null }
            console.log(error.meta)
        }
        console.error(error)
        return {
            error: 'Error al crear la carrera, intente nuevamente.',
            career: null,
        }
    }
}

export async function editCareer(formData: FormData) {
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const alias = formData.get('alias') as string

    try {
        await db.career.update({
            where: {
                id,
            },
            data: {
                name,
                alias,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Ocurrio un error, intente nuevamente.' }
    }
}

export async function getCareers() {
    return await db.career.findMany({
        where: {
            status: {
                not: STATUS.DELETED,
            },
        },
    })
}

export async function getActiveCareers() {
    return await db.career.findMany({
        where: {
            status: STATUS.ACTIVE,
        },
    })
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
                alias: id,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}
