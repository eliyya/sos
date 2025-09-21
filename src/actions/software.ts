'use server'

import { Prisma } from '@prisma/client'
import { db } from '@/prisma/db'

export async function getSoftware() {
    return db.software.findMany()
}

export async function editSoftware(formData: FormData) {
    const name = formData.get('name') as string
    const id = formData.get('id') as string

    try {
        await db.software.update({
            where: { id },
            data: { name },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal' }
    }
}

export async function deleteSoftware(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.software.delete({ where: { id } })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}

export async function createSoftware(formData: FormData) {
    const name = formData.get('name') as string

    if (!name) return { error: 'Falta algun dato' }

    try {
        const data = await db.software.create({
            data: {
                name,
            },
        })
        return { error: null, data }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002')
                return { error: 'El software ya existe' }
            console.log(error.meta)
        }
        console.error(error)
        return { error: 'Algo sucedió, intenta más tarde' }
    }
}
// TODO: check role
