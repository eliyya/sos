'use server'

import { RoleBitField, RoleFlags } from '@/bitfields/RoleBitField'
import { db, snowflake } from '@/prisma/db'
import { Prisma, STATUS } from '@prisma/client'
import { hash } from 'bcrypt'
import { randomUUID } from 'node:crypto'

export async function getUsers() {
    return db.user.findMany({
        where: {
            status: {
                not: STATUS.DELETED,
            },
        },
    })
}

export async function getAdminRole() {
    const role = await db.role.findFirst({
        where: { name: 'admin' },
    })
    return role
}

export async function getTeacherRole() {
    const role = await db.role.findFirst({
        where: { name: 'teacher' },
    })
    return role
}

export async function getTeachersActive() {
    return db.user.findMany({
        where: {
            status: STATUS.ACTIVE,
        },
    })
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
    const role = formData
        .getAll('roles')
        .map(t => BigInt(t as string))
        .reduce((a, b) => a + b, 0n)
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
                username: username.toLowerCase(),
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

export async function deleteUser(formData: FormData) {
    const id = formData.get('id') as string
    try {
        await db.user.update({
            where: {
                id,
            },
            data: {
                status: STATUS.DELETED,
                name: randomUUID().replace(/-/g, ''),
                username: randomUUID().replace(/-/g, ''),
                role: 0n,
            },
        })
        await db.auth.deleteMany({
            where: {
                user_id: id,
            },
        })
        await db.session.deleteMany({
            where: {
                user_id: id,
            },
        })
        return { error: null }
    } catch {
        return { error: 'Algo sucedio mal, intente nuevamente' }
    }
}

export async function createUser(formData: FormData) {
    const name = formData.get('name') as string
    const username = formData.get('username') as string
    const role = formData
        .getAll('roles')
        .map(t => BigInt(t as string))
        .reduce((a, b) => a + b, 0n)
    const password = formData.get('password') as string
    const confirm = formData.get('password-confirm') as string

    if (!name || !username) return { error: 'Falta algun dato' }

    const allRoles = new RoleBitField(
        RoleFlags.Admin + RoleFlags.Teacher + RoleFlags.Anonymous,
    )
    if (role <= 0n || role > allRoles.toBigInt())
        return { error: 'Rol fuera de rango' }

    if (password) {
        if (!/[A-Z]/.test(password))
            return {
                password: 'La contraseña debe contener al menos una mayúscula',
            }
        if (!/[0-9]/.test(password))
            return {
                password: 'La contraseña debe contener al menos un número',
            }
        if (!/[!@#$%^&*]/.test(password))
            return {
                password:
                    'La contraseña debe contener al menos un carácter especial como !@#$%^&*',
            }
        if (password.length < 10)
            return {
                password: 'La contraseña debe tener al menos 10 caracteres',
            }
    }

    if (password && password !== confirm)
        return { confirm: 'Las contraseñas no coinciden' }

    try {
        await db.user.create({
            data: {
                id: snowflake.generate(),
                name,
                username: username.toLowerCase(),
                auths: {
                    create: {
                        id: snowflake.generate(),
                        password: await hash(password, 10),
                    },
                },
            },
        })
        return {}
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') return { error: 'El usuario ya existe' }
            console.log(error.meta)
        }
        console.error(error)
        return { error: 'Algo sucedió, intenta más tarde' }
    }
}
// TODO: check role

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

export async function getUser(id: string) {
    return await db.user.findUnique({
        where: {
            id,
        },
    })
}
