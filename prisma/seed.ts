process.loadEnvFile()
import { SnowFlakeGenerator } from '../src/lib/SnowFlake.ts'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const db = new PrismaClient()
const snowflake = new SnowFlakeGenerator()

await db.user.deleteMany()
if (
    !process.env.FIRST_ADMIN_USERNAME ||
    !process.env.FIRST_ADMIN_NAME ||
    !process.env.FIRST_ADMIN_PASSWORD
)
    throw new Error('FIRST_ADMIN variables not found')

await db.user.create({
    data: {
        id: snowflake.generate(),
        name: process.env.FIRST_ADMIN_NAME,
        username: process.env.FIRST_ADMIN_USERNAME,
        role: 1,
        auths: {
            create: {
                id: snowflake.generate(),
                password: await hash(process.env.FIRST_ADMIN_PASSWORD, 10),
            },
        },
    },
})
