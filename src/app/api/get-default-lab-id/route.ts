import { db } from '@/prisma/db'
import { LABORATORY_TYPE } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET() {
    const lab_id = await db.laboratory.findFirst({
        select: { id: true },
        where: { type: LABORATORY_TYPE.LABORATORY },
    })
    return new NextResponse(JSON.stringify({ lab_id: lab_id?.id ?? null }))
}
