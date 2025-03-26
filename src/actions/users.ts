'use server'

// import { COOKIES, JWT_SECRET } from '@/lib/constants'
import { db, snowflake } from '@/lib/db'
import { STATUS } from '@prisma/client'
import { hash } from 'bcrypt'
// import { UserSchema } from '@/lib/schemas'
// import app from '@eliyya/type-routes'
// import { compare, hash } from 'bcrypt'
// import { SignJWT } from 'jose'
// import { cookies } from 'next/headers'
// import * as z from 'zod'

export async function getUsers() {
    return db.user.findMany()
}

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
            id: snowflake.generate(),
            name,
            username,
            role: 1n,
            auths: {
                create: {
                    id: snowflake.generate(),
                    password: await hash(password, 10),
                },
            },
        },
    })
}

export async function editUser(formData: FormData) {
    let role = 0n
    for (const rol of formData.getAll('roles').map(t => BigInt(t as string)))
        role += rol
    const username = formData.get('username') as string
    const name = formData.get('name') as string
    const id = formData.get('id') as string

    try {
        await db.user.update({
            where: {
                id,
            },
            data: {
                name,
                username,
                role,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal' }
    }
}

export async function archiveUser(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.user.update({
            where: {
                id,
            },
            data: {
                status: STATUS.ARCHIVED,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}

export async function unarchiveUser(formData: FormData) {
    const id = formData.get('id') as string
    try {
        const user = await db.user.findFirst({
            where: {
                id,
            },
            select: {
                status: true,
            },
        })
        if (user && user.status === STATUS.DELETED)
            return { error: 'Usuario eliminado, no se puede recuperar' }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
    try {
        await db.user.update({
            where: {
                id,
            },
            data: {
                status: STATUS.ACTIVE,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}

// /**
//  *
//  * @throws Password or user incorrect
//  * @throws `Password has been changued since {Date}`
//  * @throws Internal error
//  */
// export async function login({
// password,
// username,
// }: {
// password: string
// username: string
// }) {
// const user = await db.user.findUnique({
//     where: {
//         username,
//     },
//     include: {
//         passwords: {
//             orderBy: {
//                 created_at: 'desc',
//             },
//         },
//     },
// })

// if (!user) throw new Error('Password or user incorrect')

// const [currentPassword, ...oldPasswords] = user.passwords
// if (!(await compare(password, currentPassword.password))) {
//     for (const { password: oldPassword, created_at } of oldPasswords) {
//         if (await compare(password, oldPassword))
//             throw new Error(
//                 'Password has been changued since ' + created_at,
//             )
//     }
//     throw new Error('Password or user incorrect')
// }

// const expires = new Date()
// expires.setDate(expires.getDate() + 1)
// try {
//     const token = await new SignJWT({
//         ...user,
//         roles: user.roles.toString(),
//         exp: expires.getTime(),
//     })
//         .setProtectedHeader({ alg: 'HS256' })
//         .setIssuedAt()
//         .setExpirationTime('1d')
//         .sign(JWT_SECRET)
//     ;(await cookies()).set(COOKIES.SESSION, token, {
//         expires,
//         path: '/',
//         httpOnly: true,
//     })

//     const p = UserSchema.safeParse(user)
//     console.log(p)
// } catch (error) {
//     console.error(error)
//     throw new Error('Internal error', { cause: error })
// }
// }
