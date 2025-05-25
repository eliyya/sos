'use server'
import { COOKIES } from '@/constants/client'
import { cookies } from 'next/headers'
import { ENCODED_JWT_SECRET } from '@/constants/server'
import { UserTokenPayload } from '@/lib/types'
import { jwtVerify } from 'jose'

export async function getPaylodadUser() {
    const token = (await cookies()).get(COOKIES.SESSION)?.value
    if (!token) return null
    try {
        const { payload } = await jwtVerify(token, ENCODED_JWT_SECRET)
        return <UserTokenPayload>payload
    } catch {
        return null
    }
}
