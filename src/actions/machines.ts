'use server'

import { db, snowflake } from '@/prisma/db'
import { MACHINE_STATUS, Prisma } from '@prisma/client'
export async function getMachine() {
    return await db.machine.findMany({
        where: {
            status: {
                not: MACHINE_STATUS.OUT_OF_SERVICE,
            },
        },
    })
}
export async function editMachine(formData: FormData) {
    const id = formData.get('id') as string
    const serie = formData.get('serie') as string
    const processor = formData.get('processor') as string
    const ram = formData.get('ram') as string
    const number = formData.get('number') as string
    const storage = formData.get('storage') as string
    const description = formData.get('description') as string
    let laboratory_id = formData.get('laboratory_id') as string | null
    laboratory_id ||= null

    try {
        await db.machine.update({
            where: {
                id,
            },
            data: {
                number: Number(number),
                processor,
                ram,
                storage,
                description,
                serie,
                laboratory_id,
            },
        })
        return {}
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.log(error)
            console.log(error.meta)
        }
        return { error: 'Algo sucedió, intenta más tarde' }
    }
}
export async function deleteMachine(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.machine.update({
            where: {
                id,
            },
            data: {
                status: MACHINE_STATUS.OUT_OF_SERVICE,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}
export async function archiveMachine(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.machine.update({
            where: {
                id,
            },
            data: {
                status: MACHINE_STATUS.AVAILABLE,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}

export async function getMachines() {
    return db.machine.findMany({
        where: {
            status: {
                not: MACHINE_STATUS.OUT_OF_SERVICE,
            },
        },
    })
}

export async function createMachine(formData: FormData) {
    const serie = formData.get('serie') as string
    const processor = formData.get('processor') as string
    const ram = formData.get('ram') as string
    const number = formData.get('number') as string
    const storage = formData.get('storage') as string
    const description = formData.get('description') as string

    try {
        await db.machine.create({
            data: {
                id: snowflake.generate(),
                number: Number(number),
                processor,
                ram,
                storage,
                description,
                serie,
                status: MACHINE_STATUS.AVAILABLE,
            },
        })
        return {}
    } catch {
        return { error: 'Algo sucedió, intenta más tarde' }
    }
}
// TODO: check role
