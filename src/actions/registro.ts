'use server'

import { snowflake } from '@/lib/constants'
import { db } from '@/lib/db'
import { hash } from 'bcrypt'

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
    await db.users.create({
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
