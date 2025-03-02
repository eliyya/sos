process.loadEnvFile()
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const db = new PrismaClient()

await db.user.deleteMany()
if (
    !process.env.FIRST_ADMIN_USERNAME ||
    !process.env.FIRST_ADMIN_NAME ||
    !process.env.FIRST_ADMIN_PASSWORD
)
    throw new Error('FIRST_ADMIN variables not found')

await db.user.create({
    data: {
        name: process.env.FIRST_ADMIN_NAME,
        username: process.env.FIRST_ADMIN_USERNAME,
        role: 1,
        auths: {
            create: {
                password: await hash(process.env.FIRST_ADMIN_PASSWORD, 10),
            },
        },
    },
})
