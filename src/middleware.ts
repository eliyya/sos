import { NextRequest, NextResponse } from 'next/server'
import { HEADERS } from '@/lib/constants'

function injectPathname(request: NextRequest, response: NextResponse) {
    response.headers.set(HEADERS.PATHNAME, request.nextUrl.pathname)
    return response
}

export async function middleware(request: NextRequest) {
    const next = () => injectPathname(request, NextResponse.next())
    return next()
}
