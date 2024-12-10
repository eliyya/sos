import { PrismaClient } from '@prisma/client'
import { getAdmins } from '@prisma/client/sql'
import { Snowflake } from '@sapphire/snowflake'
import { hash } from 'bcrypt'

const db = new PrismaClient()
const snowflake = new Snowflake(new Date())

const admins = await db.$queryRawTyped(getAdmins())

await db.password.deleteMany()
await db.user.deleteMany()
if (
    !process.env.FIRST_ADMIN_USERNAME ||
    !process.env.FIRST_ADMIN_NAME ||
    !process.env.FIRST_ADMIN_PASSWORD
)
    throw new Error('FIRST_ADMIN variables not found')

await db.user.create({
    data: {
        id: snowflake.generate().toString(),
        name: process.env.FIRST_ADMIN_NAME,
        username: process.env.FIRST_ADMIN_USERNAME,
        roles: 1,
        passwords: {
            create: {
                id: snowflake.generate().toString(),
                password: await hash(process.env.FIRST_ADMIN_PASSWORD, 10),
            },
        },
    },
})
