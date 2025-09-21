import { Temporal } from '@js-temporal/polyfill'
import { NextResponse } from 'next/server'
import { db } from '@/prisma/db'

export async function POST(req: Request) {
    const body = await req.formData()
    const from = body.get('from') as string
    const to = body.get('to') as string
    const laboratory_id = body.get('laboratory_id') as string
    const format = body.get('format') as string
    const start_timestamp = Temporal.PlainDate.from(from).toZonedDateTime({
        timeZone: 'America/Mexico_City',
    }).epochMilliseconds
    const end_timestamp = Temporal.PlainDate.from(to)
        .toZonedDateTime({
            timeZone: 'America/Mexico_City',
        })
        .add({ days: 1 })
        .subtract({ seconds: 1 }).epochMilliseconds
    const query = await db.visit.findMany({
        where: {
            created_at: {
                gte: new Date(start_timestamp),
                lte: new Date(end_timestamp),
            },
            laboratory_id: laboratory_id,
        },
        include: {
            laboratory: true,
            student: {
                include: {
                    career: true,
                },
            },
        },
    })
    const data = query.map(visit => ({
        ...visit,
        laboratory_name: visit.laboratory.name,
        student_name: visit.student.firstname + ' ' + visit.student.lastname,
        career_name: visit.student.career.name,
    }))
    if (format === 'csv') {
        const csv = `${Object.keys(data[0]).join(',')}${data.map(d => '\n' + Object.values(d).join(','))}`

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="visits-from-${from}-to-${to}.csv"`,
            },
        })
    }
    return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="visits-from-${from}-to-${to}.json"`,
        },
    })
}
