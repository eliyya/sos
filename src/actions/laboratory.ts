'use server'

import { db, snowflake } from '@/prisma/db'
import { timeToMinutes } from '@/lib/utils'
import { LABORATORY_TYPE, STATUS } from '@prisma/client'
import { getPaylodadUser } from './middleware'
import { RoleBitField, RoleFlags } from '@/bitfields/RoleBitField'
import { Temporal } from '@js-temporal/polyfill'

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

export async function getLaboratory() {
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
    const name = formData.get('name') as string
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

export async function createlab(formData: FormData) {
    const name = formData.get('name') as string
    const openHour = formData.get('open_hour') as string
    const closeHour = formData.get('close_hour') as string
    const type = formData.get('type') as LABORATORY_TYPE
    const open_hour = timeToMinutes(openHour)
    const close_hour = timeToMinutes(closeHour)

    if (!name) return { error: 'Por favor complete todos los campos' }

    if (open_hour >= close_hour)
        return { error: 'La hora de apertura debe ser menor a la de cierre' }

    try {
        await db.laboratory.create({
            data: {
                id: snowflake.generate(),
                open_hour,
                close_hour,
                type,
                name,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Error al crear el laboratorio, intente nuevamente.' }
    }
}

export async function getActiveLaboratories() {
    return await db.laboratory.findMany({
        where: { status: STATUS.ACTIVE },
    })
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

export async function setAsideLaboratory(formData: FormData): Promise<{
    message: string | null
    errors: { class_id?: string; teacher_id?: string }
}> {
    const userPayload = await getPaylodadUser()
    if (!userPayload) return { message: 'No tienes acceso', errors: {} }
    const roles = new RoleBitField(BigInt(userPayload.role))
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
    if (!roles.has(RoleFlags.Admin) && !class_id)
        return {
            message: 'Faltan datos',
            errors: { class_id: 'Este campo es requerido' },
        }
    class_id ||= null
    let registered_by = teacher_id
    try {
        await db.user.validatePassword({ id: teacher_id }, password)
    } catch {
        if (roles.has(RoleFlags.Admin) && teacher_id !== userPayload.sub) {
            try {
                await db.user.validatePassword(
                    { id: userPayload.sub },
                    password,
                )
                registered_by = userPayload.sub
            } catch {
                return {
                    message: 'La contraseña es incorrecta',
                    errors: { teacher_id: 'La contraseña es incorrecta' },
                }
            }
        } else
            return {
                message: 'La contraseña es incorrecta',
                errors: { teacher_id: 'La contraseña es incorrecta' },
            }
    }
    await db.practice.create({
        data: {
            id: snowflake.generate(),
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
