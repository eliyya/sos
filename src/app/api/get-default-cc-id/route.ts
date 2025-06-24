import { GET_DEFAULT_CC_ID_ERROR } from '@/errors/api'
import { db } from '@/prisma/db'
import { LABORATORY_TYPE, Prisma } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const cc_id = await db.laboratory.findFirst({
            select: { id: true },
            where: { type: LABORATORY_TYPE.COMPUTER_CENTER },
        })
        return new NextResponse(JSON.stringify({ cc_id: cc_id?.id ?? null }))
    } catch (error) {
        if (error instanceof Prisma.PrismaClientInitializationError) {
            console.error(
                `Error ${error.errorCode} initializing Prisma client:`,
                error.message,
            )
            return new NextResponse(
                JSON.stringify({
                    error: GET_DEFAULT_CC_ID_ERROR.DATABASE_INITIALIZATION_ERROR,
                }),
                { status: 500 },
            )
        }
        console.error('Error fetching default cc ID:', error)
        return new NextResponse(
            JSON.stringify({
                error: GET_DEFAULT_CC_ID_ERROR.GENERIC_ERROR,
            }),
            { status: 500 },
        )
    }
}
