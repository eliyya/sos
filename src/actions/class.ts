'use server'

import { Temporal } from '@js-temporal/polyfill'
import { Class, Prisma, STATUS } from '@/prisma/generated/client'
import { getStartOfWeek } from '@/lib/utils'
import { db } from '@/prisma/db'

export async function checkClassDisponibility({
    subject_id,
    teacher_id,
    group,
    semester,
    career_id,
}: {
    subject_id: string
    teacher_id: string
    group: number
    semester: number
    career_id: string
}): Promise<
    | { status: 'available'; clase: null }
    | { status: 'taken' | 'archived'; clase: Class }
> {
    const clase = await db.class.findFirst({
        where: {
            subject_id,
            teacher_id,
            group,
            semester,
            career_id,
        },
    })

    if (clase?.status === STATUS.ACTIVE)
        return { status: 'taken', clase: clase }
    if (clase?.status === STATUS.ARCHIVED)
        return { status: 'archived', clase: clase }
    return { status: 'available', clase: null }
}

export async function createClass(formData: FormData) {
    const subject_id = formData.get('subject_id') as string
    const teacher_id = formData.get('teacher_id') as string
    const career_id = formData.get('career_id') as string
    const group = formData.get('group') as string
    const semester = formData.get('semester') as string

    try {
        await db.class.create({
            data: {
                subject_id,
                teacher_id,
                career_id,
                group: parseInt(group),
                semester: parseInt(semester),
            },
        })
        return { error: null }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') return { error: 'La clase ya existe' }
            console.log(error.meta)
        }
        console.error(error)

        return { error: 'Error al crear la clase, intente nuevamente.' }
    }
}

interface GetRemainingHoursParams {
    classId: string
    /**
     * The day to query in epoch milliseconds
     */
    day: number
}
export async function getRemainingHours({
    classId,
    day,
}: GetRemainingHoursParams) {
    // Convertir timestamp a fecha en zona horaria local (America/Monterrey)
    const dayDate =
        Temporal.Instant.fromEpochMilliseconds(day).toZonedDateTimeISO(
            'America/Monterrey',
        )

    // Obtener el inicio del domingo de esa semana (semana empieza en domingo)
    const startOfWeek = getStartOfWeek(dayDate)
    const endOfWeek = startOfWeek.add({ days: 7 })

    // Obtener clase y subject
    const classData = await db.class.findUnique({
        where: { id: classId },
        select: {
            subject: {
                select: {
                    practice_hours: true,
                },
            },
        },
    })

    if (!classData?.subject?.practice_hours) {
        throw new Error('Clase o subject inválido')
    }

    const allowedHours = classData.subject.practice_hours

    // Consultar prácticas dentro del rango de la semana
    const practices = await db.practice.findMany({
        where: {
            class_id: classId,
            starts_at: {
                gte: startOfWeek.toInstant().toString(),
                lte: endOfWeek.toInstant().toString(),
            },
        },
        select: {
            starts_at: true,
            ends_at: true,
        },
    })

    // Calcular duración total
    const usedHours = practices.reduce((total, p) => {
        const start = Temporal.Instant.fromEpochMilliseconds(
            p.starts_at.getTime(),
        )
        const end = Temporal.Instant.fromEpochMilliseconds(p.ends_at.getTime())
        const duration = end.since(start, { largestUnit: 'hours' })
        return total + duration.total({ unit: 'hour' })
    }, 0)

    const leftHours = Math.max(allowedHours - usedHours, 0)

    return {
        leftHours: Math.floor(leftHours),
        allowedHours,
        usedHours,
    }
}

export async function editClass(formData: FormData) {
    const id = formData.get('id') as string
    const subject_id = formData.get('subject_id') as string
    const teacher_id = formData.get('teacher_id') as string
    const career_id = formData.get('career_id') as string
    const group = formData.get('career_id') as string

    try {
        await db.class.update({
            where: { id },
            data: {
                subject_id,
                teacher_id,
                career_id,
                group: parseInt(group),
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

type ClassDataToInclude = 'subject' | 'career' | 'teacher'
// | 'students'
export async function getClassesWithDataFromUser<
    T extends ClassDataToInclude[],
    // W extends number | undefined,
>(
    userId: string,
    dataToInclude?: T,
    // week?: W,
): Promise<
    Array<
        Awaited<
            ReturnType<
                typeof db.class.findMany<{
                    include: {
                        subject: 'subject' extends T[number] ? true : false
                        career: 'career' extends T[number] ? true : false
                        teacher: 'teacher' extends T[number] ? true : false
                        StudentClasses: 'students' extends T[number] ?
                            { include: { student: true } }
                        :   false
                    }
                }>
            >
        >[number]
        // &
        //     (W extends number ? { left_hours: number } : object)
    >
> {
    const includes = (dataToInclude ?? []) as ClassDataToInclude[]

    const classes = await db.class.findMany({
        where: {
            teacher_id: userId,
            status: STATUS.ACTIVE,
        },
        include: {
            subject: includes.includes('subject'),
            career: includes.includes('career'),
            teacher: includes.includes('teacher'),
            // StudentClasses:
            //     !includes.includes('students') ?
            //         false
            //     :   {
            //             include: {
            //                 student: true,
            //             },
            //         },
        },
    })
    // @ts-expect-error Just ignore
    return classes
}

export async function getActiveClassesWithData() {
    return await db.class.findMany({
        where: {
            status: STATUS.ACTIVE,
        },
        include: {
            subject: true,
            teacher: true,
            career: true,
        },
    })
}
export async function getDisponibleClassesWithData() {
    return await db.class.findMany({
        where: {
            status: {
                not: STATUS.DELETED,
            },
        },
        include: {
            subject: true,
            teacher: true,
            career: true,
        },
    })
}

export async function archiveClass(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.class.update({
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
