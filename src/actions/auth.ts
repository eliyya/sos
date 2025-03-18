'use server'
import { COOKIES } from '@/lib/constants'
import { cookies } from 'next/headers'
import { ENCODED_JWT_SECRET } from '@/constants/server'
import { db } from '@/lib/db'
import {
    LoginFormState,
    AuthTypes,
    LoginFormStatus,
    RefreshTokenPayload,
    JWTPayload,
} from '@/lib/types'
import { decodeJwt, jwtVerify, SignJWT } from 'jose'
import { NEXT_PUBLIC_AGENCY, NEXT_PUBLIC_VERCEL_URL } from '@/env/client'
import { wrapTry } from '@/lib/utils'
import { randomBytes } from 'node:crypto'
import { decrypt, encrypt } from '@/lib/encrypt'

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
    return await db.devices.create({
        data: {
            employee_id: user_id,
            ip,
            expires_at: expiresAt,
            browser,
            device,
            os,
            model,
            encripted_secret,
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
    const deviceData = await db.devices.findFirst({
        where: {
            id: Number(payload.device_id),
        },
        include: {
            employee: true,
        },
    })
    if (!deviceData) return { error: 'Device not found' }
    if (new Date() > deviceData.expires_at) {
        db.devices.delete({
            where: {
                id: Number(payload.device_id),
            },
        })
        return {
            error: 'Device expired',
        }
    }
    const secret = await decrypt(deviceData.encripted_secret)
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
        aud: NEXT_PUBLIC_AGENCY,
        sub: deviceData.employee_id,
        type: AuthTypes.session,
        name: deviceData.employee.name,
        role: deviceData.employee.role.toString(),
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
        ip: string
        browser: string
        device: string
        os: string
        model: string
    },
): Promise<LoginFormState> {
    // validate email and password
    const email = data.get('email') as string
    if (!email) {
        return {
            errors: {
                email: 'Email is required',
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
    if (!(await db.employee.validatePassword(email, password))) {
        return {
            message: 'Email or password is incorrect',
            status: LoginFormStatus.error,
        }
    }

    // get employee
    const employee = (await db.employee.findFirst({
        where: {
            email,
        },
        select: {
            id: true,
            name: true,
            role: true,
        },
    }))!

    if (await db.employee.hasTOTP(employee.id)) {
        const token = data.get('token') as string
        if (!token) {
            return {
                errors: {
                    token: 'Token is required',
                },
                status: LoginFormStatus.error,
            }
        }
        const isValid = await db.employee.validateTOTP(employee.id, token)
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
        user_id: employee.id,
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
        aud: NEXT_PUBLIC_AGENCY,
        sub: employee.id,
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
