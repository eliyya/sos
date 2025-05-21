import { db } from '@/prisma/db'
import { NextResponse } from 'next/server'

export async function GET() {
    const lab_id = await db.laboratory.findFirst({ select: { id: true } })
    return new NextResponse(JSON.stringify({ lab_id: lab_id?.id ?? null }))
}
