'use server'
import { COOKIES, JWT_SECRET } from '@/lib/constants'
import { UserSchema } from '@/lib/schemas'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export async function getUser() {
    const token = (await cookies()).get(COOKIES.SESSION)?.value
    if (!token) return null

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        try {
            return UserSchema.parse(payload)
        } catch (error) {
            console.log('z', error)
            return null
        }
    } catch (error) {
        return null
    }
}
