import app from '@eliyya/type-routes'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
    await auth.api.signOut({ headers: await headers() })
    return NextResponse.redirect(
        new URL(app.$locale.auth.login('es'), request.nextUrl),
    )
}
