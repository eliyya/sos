import { db } from '@/lib/db'
import app from '@eliyya/type-routes'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const lab = await db.query.Laboratory.findFirst({
        columns: {
            id: true,
        },
    })
    if (lab)
        return NextResponse.redirect(
            new URL(app.labs.$id(lab.id), request.nextUrl),
        )
    return NextResponse.redirect(new URL(app.labs.null(), request.nextUrl))
}
