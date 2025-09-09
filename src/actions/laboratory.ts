'use server'

import { db } from '@/prisma/db'
import { timeToMinutes } from '@/lib/utils'
import { LABORATORY_TYPE, Prisma, STATUS } from '@prisma/client'
import { Temporal } from '@js-temporal/polyfill'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import {
    PermissionsBitField,
    PermissionsFlags,
} from '@/bitfields/PermissionsBitField'

export async function unarchiveLaboratory(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.laboratory.update({
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

export async function getLaboratories() {
    return await db.laboratory.findMany({
        where: {
            status: {
                not: STATUS.DELETED,
            },
        },
    })
}

export async function editLaboratory(formData: FormData) {
    const id = formData.get('id') as string
    const name = (formData.get('name') as string).trim()
    const type = formData.get('type') as LABORATORY_TYPE
    const openHour = formData.get('open_hour') as string
    const closeHour = formData.get('close_hour') as string
    const open_hour = timeToMinutes(openHour)
    const close_hour = timeToMinutes(closeHour)

    if (open_hour >= close_hour)
        return { error: 'La hora de apertura debe ser menor a la de cierre' }

    try {
        await db.laboratory.update({
            where: {
                id,
            },
            data: {
                name,
                open_hour,
                close_hour,
                type,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Error al editar el laboratorio, intente nuevamente.' }
    }
}

export async function deleteLaboratory(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.laboratory.update({
            where: {
                id,
            },
            data: {
                status: STATUS.DELETED,
                name: id,
                open_hour: -1,
                close_hour: -1,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}

export async function createlab(formData: FormData): Promise<
    | { error: null; message: null }
    | {
          error: 'MISSING_FIELDS'
          message: 'Por favor complete todos los campos'
      }
    | {
          error: 'DATA_ERROR'
          message: 'La hora de apertura debe ser menor a la de cierre'
      }
    | {
          error: 'ALREADY_EXISTS'
          message:
              | 'El laboratorio ya existe'
              | 'El laboratorio se encuentra archivado'
      }
    | {
          error: 'SERVER_ERROR'
          message: 'Error al crear el laboratorio, intente nuevamente.'
      }
> {
    const name = (formData.get('name') as string).trim()
    const openHour = formData.get('open_hour') as string
    const closeHour = formData.get('close_hour') as string
    const type = formData.get('type') as LABORATORY_TYPE
    const open_hour = timeToMinutes(openHour)
    const close_hour = timeToMinutes(closeHour)

    if (!name)
        return {
            error: 'MISSING_FIELDS',
            message: 'Por favor complete todos los campos',
        }

    if (open_hour >= close_hour)
        return {
            error: 'DATA_ERROR',
            message: 'La hora de apertura debe ser menor a la de cierre',
        }

    // CHECK IF EXISTS
    const exists = await db.laboratory.findFirst({ where: { name } })
    if (exists?.status === STATUS.ARCHIVED) {
        // dar opcion de reactivar
        return {
            error: 'ALREADY_EXISTS',
            message: 'El laboratorio se encuentra archivado',
        }
    }
    if (exists)
        return { error: 'ALREADY_EXISTS', message: 'El laboratorio ya existe' }

    try {
        await db.laboratory.create({
            data: {
                open_hour,
                close_hour,
                type,
                name,
            },
        })
        return { error: null, message: null }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002')
                return {
                    error: 'ALREADY_EXISTS',
                    message: 'El laboratorio ya existe',
                }
            console.log(error.meta)
        }
        console.error(error)
        return {
            error: 'SERVER_ERROR',
            message: 'Error al crear el laboratorio, intente nuevamente.',
        }
    }
}

export async function getActiveLaboratories() {
    return await db.laboratory.findMany({
        where: { status: STATUS.ACTIVE },
    })
}

export async function archiveLaboratory(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.laboratory.update({
            where: {
                id,
            },
            data: {
                status: STATUS.ARCHIVED,
            },
        })
        return { error: null, message: null }
    } catch {
        return {
            error: 'SERVER_ERROR',
            message: 'Algo sucedio mal, intente nuevamente',
        }
    }
}

export async function setAsideLaboratory(formData: FormData): Promise<{
    message: string | null
    errors: { class_id?: string; teacher_id?: string }
}> {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session) return { message: 'No tienes acceso', errors: {} }
    const permissions = new PermissionsBitField(
        BigInt(session.user.permissions),
    )
    const teacher_id = formData.get('teacher_id') as string
    let class_id: string | null = formData.get('class_id') as string
    const laboratory_id = formData.get('laboratory_id') as string
    const name = formData.get('name') as string
    const topic = formData.get('topic') as string
    const time = formData.get('time') as string
    const password = formData.get('password') as string
    const students = formData.get('students') as string
    const starts_at = Temporal.Instant.fromEpochMilliseconds(
        parseInt(formData.get('starts_at') as string),
    )
    const ends_at = starts_at.add({ hours: parseInt(time) })
    if (!permissions.has(PermissionsFlags.ADMIN) && !class_id)
        return {
            message: 'Faltan datos',
            errors: { class_id: 'Este campo es requerido' },
        }
    class_id ||= null
    let registered_by = teacher_id
    const authContext = await auth.$context
    const teacher = await db.account.findFirst({
        where: { user_id: teacher_id },
        select: { password: true },
    })
    if (!teacher) return { message: 'El usuario no existe', errors: {} }
    let passVerified = authContext.password.verify({
        password,
        hash: teacher.password ?? '',
    })
    if (!passVerified) {
        if (
            permissions.has(PermissionsFlags.ADMIN) &&
            teacher_id !== session.user.id
        ) {
            const user = await db.account.findFirst({
                where: { user_id: teacher_id },
                select: { password: true },
            })
            if (!user) return { message: 'El usuario no existe', errors: {} }
            passVerified = authContext.password.verify({
                password,
                hash: user.password ?? '',
            })
            registered_by = session.user.id
            if (!passVerified)
                return {
                    message: 'La contraseña es incorrecta',
                    errors: { teacher_id: 'La contraseña es incorrecta' },
                }
        } else
            return {
                message: 'La contraseña es incorrecta',
                errors: { teacher_id: 'La contraseña es incorrecta' },
            }
    }
    await db.practice.create({
        data: {
            topic,
            name,
            students: parseInt(students),
            teacher_id,
            class_id,
            laboratory_id,
            registered_by,
            starts_at: new Date(starts_at.epochMilliseconds),
            ends_at: new Date(ends_at.epochMilliseconds),
        },
    })
    return { message: null, errors: {} }
}

export async function findManyLaboratories<
    Q extends Prisma.LaboratoryFindManyArgs,
    R extends Awaited<ReturnType<typeof db.laboratory.findMany<Q>>>,
>(query: Q): Promise<R> {
    // @ts-expect-error just ignore
    return await db.laboratory.findMany(query)
}
