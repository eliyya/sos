'use server'

import { db } from '@/prisma/db'

export async function deletePractice(formData: FormData) {
    const id = formData.get('practice_id') as string
    try {
        await db.reservation.delete({ where: { id } })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}

export async function editPractice(formData: FormData) {
    const id = formData.get('practice_id') as string
    const name = formData.get('name') as string
    const observations = formData.get('observations') as string | null
    const starts_at = formData.get('starts_at') as string
    const ends_at = formData.get('ends_at') as string
    const students = formData.get('students') as string
    const topic = formData.get('topic') as string
    try {
        await db.reservation.update({
            where: { id },
            data: {
                name,
                observations,
                starts_at,
                ends_at,
                students: parseInt(students),
                topic,
                updated_at: new Date(),
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}
