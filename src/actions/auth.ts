'use server'
import { COOKIES } from '@/constants/client'
import { cookies } from 'next/headers'
import { ENCODED_JWT_SECRET } from '@/constants/server'
import { db, snowflake } from '@/prisma/db'
import {
    LoginFormState,
    AuthTypes,
    LoginFormStatus,
    RefreshTokenPayload,
    JWTPayload,
} from '@/lib/types'
import { decodeJwt, jwtVerify, SignJWT } from 'jose'
import { NEXT_PUBLIC_VERCEL_URL } from '@/env/client'
import { wrapTry } from '@/lib/utils'
import { randomBytes } from 'node:crypto'
import { decrypt, encrypt } from '@/actions/encrypt'
import { APP_NAME } from '@/constants/client'

export async function getPaylodadUser() {
    const token = (await cookies()).get(COOKIES.SESSION)?.value
    if (!token) return null
    try {
        const { payload } = await jwtVerify(token, ENCODED_JWT_SECRET)
        return <JWTPayload>payload
    } catch {
        return null
    }
}

interface RegisterDeviceProps {
    user_id: string
    ip: string
    browser: string
    device: string
    os: string
    model: string
    secret: string
}
export async function registerDevice({
    user_id,
    ip,
    browser,
    device,
    os,
    model,
    secret,
}: RegisterDeviceProps) {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    const encripted_secret = await encrypt(secret)
    return await db.session.create({
        data: {
            user_id: user_id,
            ip,
            expires_at: expiresAt,
            browser,
            device,
            os,
            model,
            secret: encripted_secret,
            id: snowflake.generate(),
        },
        select: {
            id: true,
        },
    })
}

interface RefreshTokenProps {
    refreshToken: string
}
type RefreshTokenReturn = {
    error?:
        | 'Faltan parametros'
        | 'Refresh Token invalido'
        | 'Device not found'
        | 'Device expired'
        | 'Firma inválida'
}
export async function refreshToken({
    refreshToken,
}: RefreshTokenProps): Promise<RefreshTokenReturn> {
    if (!refreshToken) return { error: 'Faltan parametros' }
    const payload = decodeJwt<RefreshTokenPayload>(refreshToken)
    const deviceData = await db.session.findFirst({
        where: {
            id: payload.device_id,
        },
        include: {
            user: true,
        },
    })
    if (!deviceData) return { error: 'Device not found' }
    if (new Date() > deviceData.expires_at) {
        db.session.delete({
            where: {
                id: payload.device_id,
            },
        })
        return {
            error: 'Device expired',
        }
    }
    const secret = await decrypt(deviceData.secret)
    const [error] = await wrapTry(() =>
        jwtVerify<RefreshTokenPayload>(
            refreshToken,
            new TextEncoder().encode(secret),
        ),
    )
    if (error) return { error: 'Refresh Token invalido' }

    const expires = new Date()
    expires.setDate(expires.getDate() + 1)
    const npayload: JWTPayload = {
        exp: expires.getTime() / 1000,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000) - 1,
        iss: NEXT_PUBLIC_VERCEL_URL,
        aud: APP_NAME,
        sub: deviceData.user_id,
        type: AuthTypes.session,
        name: deviceData.user.name,
        role: deviceData.user.role.toString(),
    }
    const accesToken = await new SignJWT(npayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1d')
        .sign(ENCODED_JWT_SECRET)

    // set cookie in session
    const cookieStore = await cookies()
    cookieStore.set({
        name: COOKIES.SESSION,
        value: accesToken,
        expires,
        path: '/',
        httpOnly: true,
    })
    return {}
}

export async function login(
    data: FormData,
    dinfo: {
        browser: string
        device: string
        os: string
        model: string
    },
): Promise<LoginFormState> {
    // validate email and password
    const username = data.get('username') as string
    if (!username) {
        return {
            errors: {
                username: 'Username is required',
            },
            status: LoginFormStatus.error,
        }
    }

    const password = data.get('password') as string
    if (!password) {
        return {
            errors: {
                password: 'Password is required',
            },
            status: LoginFormStatus.error,
        }
    }

    // validate email and password
    if (!(await db.user.validatePassword(username, password))) {
        return {
            message: 'Email or password is incorrect',
            status: LoginFormStatus.error,
        }
    }

    // get user
    const user = (await db.user.findFirst({
        where: {
            username,
        },
        select: {
            id: true,
            name: true,
            role: true,
        },
    }))!

    if (await db.user.hasTOTP(user.id)) {
        const token = data.get('token') as string
        if (!token) {
            return {
                errors: {
                    token: 'Token is required',
                },
                status: LoginFormStatus.error,
            }
        }
        const isValid = await db.user.validateTOTP(user.id, token)
        if (!isValid)
            return {
                errors: {
                    token: 'Token is not valid',
                },
                status: LoginFormStatus.error,
            }
    }

    const JWT_SECRET_LOGIN = randomBytes(16).toString('hex')
    const dev = await registerDevice({
        ...dinfo,
        ip: (await cookies()).get('x-forwarded-for')?.value ?? 'unknown',
        user_id: user.id,
        secret: JWT_SECRET_LOGIN,
    })

    // create cookie
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)
    const payload: RefreshTokenPayload = {
        exp: expires.getTime() / 1000,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000) - 1,
        iss: NEXT_PUBLIC_VERCEL_URL,
        aud: APP_NAME,
        sub: user.id,
        type: AuthTypes.refresh,
        device_id: dev.id.toString(),
    }
    const refreshToken = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1w')
        .sign(new TextEncoder().encode(JWT_SECRET_LOGIN))

    // set cookie in session
    const cookieStore = await cookies()
    cookieStore.set({
        name: COOKIES.REFRESH,
        value: refreshToken,
        expires,
        path: '/',
        httpOnly: true,
    })

    return {
        status: LoginFormStatus.success,
        refreshToken: refreshToken,
    }
}
