'use server'
import { db } from '@/prisma/db'

import { createStudent } from './students'

export async function registerVisit(formData: FormData) {
    const nc = formData.get('student_nc') as string
    const laboratory_id = formData.get('laboratory_id') as string

    const student = await db.student.findFirst({
        where: { nc },
        select: { nc: true },
    })

    if (!student) {
        formData.set('nc', nc)
        await createStudent(formData)
    }

    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const is_yet = await db.visit.findFirst({
        select: { id: true },
        where: {
            laboratory_id,
            created_at: {
                gte: startOfDay,
                lte: endOfDay,
            },
            student_nc: nc,
            exit_at: null,
        },
    })

    if (is_yet) return { error: 'Ya existe una visita registrada' }

    try {
        await db.visit.create({
            data: {
                student_nc: nc,
                laboratory_id,
            },
        })
    } catch (error) {
        console.log('Error creating visit')
        console.log(error)
        return { error: 'Error interno' }
    }
    return { error: null }
}
interface getVisitsTodayProps {
    laboratory_id: string
}
export async function getVisitsToday({ laboratory_id }: getVisitsTodayProps) {
    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const visits = await db.visit.findMany({
        where: {
            laboratory_id,
            created_at: {
                gte: startOfDay,
                lte: endOfDay,
            },
            exit_at: null,
        },
    })

    return visits
}

interface endVisitProps {
    id: string
}
export async function endVisit({ id }: endVisitProps) {
    await db.visit.update({
        where: { id },
        data: {
            exit_at: new Date(),
        },
    })
}
