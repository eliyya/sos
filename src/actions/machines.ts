'use server'

import { db, snowflake } from '@/lib/db'
import { MACHINE_STATUS } from '@prisma/client'

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
