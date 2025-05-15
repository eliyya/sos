import { COOKIES } from '@/constants/client'
import app from '@eliyya/type-routes'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIES.SESSION)
    cookieStore.delete(COOKIES.REFRESH)
    return NextResponse.redirect(new URL(app.auth.login(), request.nextUrl))
}
