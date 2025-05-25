import { refreshToken } from '@/actions/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const res = await request.json()
    if (!res?.refreshToken)
        return NextResponse.json({ error: 'No refresh token' })
    const { accesToken, error } = await refreshToken({
        refreshToken: res.refreshToken,
    })
    if (error) return NextResponse.json({ error })
    return NextResponse.json({ accesToken })
}
