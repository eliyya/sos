import { Temporal } from '@js-temporal/polyfill'
import { NextResponse } from 'next/server'
import { db } from '@/prisma/db'

export async function POST(req: Request) {
    const formData = await req.formData()
    const from = formData.get('from') as string
    const to = formData.get('to') as string
    const laboratory_id = formData.get('laboratory_id') as string
    const format = formData.get('format') as string
    const start_timestamp = Temporal.PlainDate.from(from).toZonedDateTime({
        timeZone: 'America/Mexico_City',
    }).epochMilliseconds
    const end_timestamp = Temporal.PlainDate.from(to)
        .toZonedDateTime({
            timeZone: 'America/Mexico_City',
        })
        .add({ days: 1 })
        .subtract({ seconds: 1 }).epochMilliseconds
    const query = await db.practice.findMany({
        where: {
            created_at: {
                gte: new Date(start_timestamp),
                lte: new Date(end_timestamp),
            },
            laboratory_id: laboratory_id,
        },
        include: {
            laboratory: true,
            class: {
                include: {
                    career: true,
                    subject: true,
                    teacher: true,
                },
            },
            teacher: true,
            registered_by_user: true,
        },
    })
    const data = query.map(p => ({
        teacher_name: p.teacher.name,
        teacher_id: p.teacher.id,
        topic: p.topic,
        name: p.name,
        created_at: Temporal.Instant.fromEpochMilliseconds(
            p.created_at.getTime(),
        )
            .toZonedDateTimeISO('America/Mexico_City')
            .toString(),
        students: p.students,
        registered_by_id: p.registered_by,
        registered_by_name: p.registered_by_user.name,
        laboratory_id: p.laboratory_id,
        laboratory_name: p.laboratory.name,
        observations: p.observations,
        class_id: p.class_id,
        career: p.class?.career.name ?? null,
        subject: p.class?.subject.name ?? null,
        group: p.class?.group ?? null,
        starts_at: Temporal.Instant.fromEpochMilliseconds(p.starts_at.getTime())
            .toZonedDateTimeISO('America/Mexico_City')
            .toString(),
        ends_at: Temporal.Instant.fromEpochMilliseconds(p.ends_at.getTime())
            .toZonedDateTimeISO('America/Mexico_City')
            .toString(),
    }))
    if (format === 'csv') {
        const csv = `${Object.keys(data[0]).join(',')}${data.map(d => '\n' + Object.values(d).join(','))}`

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="practices-from-${from}-to-${to}.csv"`,
            },
        })
    }
    return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="practices-from-${from}-to-${to}.json"`,
        },
    })
}
