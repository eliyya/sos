import { GET_DEFAULT_LAB_ID_ERROR } from '@/errors/api'
import { db } from '@/prisma/db'
import { LABORATORY_TYPE, Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const lab_id = await db.laboratory.findFirst({
            select: { id: true },
            where: { type: LABORATORY_TYPE.LABORATORY },
        })
        return new NextResponse(JSON.stringify({ lab_id: lab_id?.id ?? null }))
    } catch (error) {
        console.error('Error fetching default lab ID:', error)
        if (error instanceof Prisma.PrismaClientInitializationError) {
            return new NextResponse(
                JSON.stringify({
                    error: GET_DEFAULT_LAB_ID_ERROR.DATABASE_INITIALIZATION_ERROR,
                }),
                { status: 500 },
            )
        }
        return new NextResponse(
            JSON.stringify({ error: GET_DEFAULT_LAB_ID_ERROR.GENERIC_ERROR }),
            { status: 500 },
        )
    }
}
