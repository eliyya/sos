'use server'
import { db, snowflake } from '@/lib/db'
import { createStudent } from './students'

export async function registerVisit(formData: FormData) {
    const nc = formData.get('student_nc') as string
    const laboratory_id = formData.get('laboratory_id') as string

    const student = await db.student.findFirst({
        where: {
            nc,
        },
    })

    if (!student) {
        await createStudent(formData)
    }
    await db.visit.create({
        data: {
            student_nc: nc,
            laboratory_id,
            id: snowflake.generate(),
        },
    })
}
