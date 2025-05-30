import { db } from '@/prisma/db'
import { LABORATORY_TYPE } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET() {
    const cc_id = await db.laboratory.findFirst({
        select: { id: true },
        where: { type: LABORATORY_TYPE.COMPUTER_CENTER },
    })
    return new NextResponse(JSON.stringify({ cc_id: cc_id?.id ?? null }))
}
