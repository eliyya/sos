'use server'

import { Machine, MACHINE_STATUS, Prisma } from '@/prisma/generated/client'
import { err, ok, Result } from '@/lib/error'
import { db } from '@/prisma/db'

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

export async function unarchiveMachine(formData: FormData) {
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

export async function archiveMachine(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.machine.update({
            where: {
                id,
            },
            data: {
                status: MACHINE_STATUS.MAINTENANCE,
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

type CreateMachineError =
    | { message: 'Algo sucedió, intenta más tarde' }
    | {
          message:
              | 'La maquina ya existe'
              | 'La maquina se encuentra fuera de servicio'
          machine: Machine
      }

/**
 *
 * @param formData
 * @returns {Promise<Result<Machine, CreateMachineError>>}
 * @throws {CreateMachineError}
 */
export async function createMachine(
    formData: FormData,
): Promise<Result<Machine, CreateMachineError>> {
    const serie = formData.get('serie') as string
    const processor = formData.get('processor') as string
    const ram = formData.get('ram') as string
    const number = formData.get('number') as string
    const storage = formData.get('storage') as string
    const description = formData.get('description') as string

    const machine = await db.machine.findUnique({ where: { serie } })
    if (machine) {
        if (machine.status === MACHINE_STATUS.OUT_OF_SERVICE) {
            return err({
                message: 'La maquina se encuentra fuera de servicio',
                machine,
            })
        }
        return err({ message: 'La maquina ya existe', machine })
    }

    try {
        return ok(
            await db.machine.create({
                data: {
                    number: Number(number),
                    processor,
                    ram,
                    storage,
                    description,
                    serie,
                    status: MACHINE_STATUS.AVAILABLE,
                },
            }),
        )
    } catch (error) {
        console.error(error)
        return err({ message: 'Algo sucedió, intenta más tarde' })
    }
}
// TODO: check role
