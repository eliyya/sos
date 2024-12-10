'use server'

import { COOKIES, JWT_SECRET, snowflake } from '@/lib/constants'
import { db } from '@/lib/db'
import { UserSchema } from '@/lib/schemas'
import app from '@eliyya/type-routes'
import { compare, hash } from 'bcrypt'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'
import * as z from 'zod'

interface RegisterProps {
    name: string
    username: string
    password: string
}
export async function registerAdmin(data: RegisterProps) {
    const name = data.name
    if (!name)
        return {
            error: 'faltan datos',
        }
    const username = data.username
    if (!username)
        return {
            error: 'faltan datos',
        }
    const password = data.password
    if (!password)
        return {
            error: 'faltan datos',
        }
    await db.user.create({
        data: {
            id: snowflake.generate().toString(),
            name,
            username,
            roles: 1,
            passwords: {
                create: {
                    id: snowflake.generate().toString(),
                    password: await hash(password, 10),
                },
            },
        },
    })
}

/**
 *
 * @throws Password or user incorrect
 * @throws `Password has been changued since {Date}`
 * @throws Internal error
 */
export async function login({
    password,
    username,
}: {
    password: string
    username: string
}) {
    const user = await db.user.findUnique({
        where: {
            username,
        },
        include: {
            passwords: {
                orderBy: {
                    created_at: 'desc',
                },
            },
        },
    })

    if (!user) throw new Error('Password or user incorrect')

    const [currentPassword, ...oldPasswords] = user.passwords
    if (!(await compare(password, currentPassword.password))) {
        for (const { password: oldPassword, created_at } of oldPasswords) {
            if (await compare(password, oldPassword))
                throw new Error(
                    'Password has been changued since ' + created_at,
                )
        }
        throw new Error('Password or user incorrect')
    }

    const expires = new Date()
    expires.setDate(expires.getDate() + 1)
    try {
        const token = await new SignJWT({
            ...user,
            roles: user.roles.toString(),
            exp: expires.getTime(),
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('1d')
            .sign(JWT_SECRET)
        ;(await cookies()).set(COOKIES.SESSION, token, {
            expires,
            path: app(),
        })

        const p = UserSchema.safeParse(user)
        console.log(p)
    } catch (error) {
        console.error(error)
        throw new Error('Internal error', { cause: error })
    }
}
