process.loadEnvFile()
import { RoleFlags } from '../bitfields/RoleBitField.ts'
import { SnowFlakeGenerator } from '../classes/SnowFlake.ts'
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
        role: 3,
        auths: {
            create: {
                id: snowflake.generate(),
                password: await hash(process.env.FIRST_ADMIN_PASSWORD, 10),
            },
        },
    },
})

if (process.env.NODE_ENV !== 'production') {
    await db.user.createMany({
        data: [
            {
                id: snowflake.generate(),
                name: 'Juan Francisco Guzman',
                username: 'guzmi',
                role: RoleFlags.Teacher + RoleFlags.Admin,
            },
            {
                id: snowflake.generate(),
                name: 'Ediberto Larkins',
                username: 'larkins',
                role: RoleFlags.Teacher,
            },
            {
                id: snowflake.generate(),
                name: 'Selene',
                username: 'selene',
                role: RoleFlags.Teacher,
            },
            {
                id: snowflake.generate(),
                name: 'Jose Antonio Castillo Gutierrez',
                username: 'castillo',
                role: RoleFlags.Teacher,
            },
            {
                id: snowflake.generate(),
                name: 'Efrain Padilla',
                username: 'efrain',
                role: RoleFlags.Teacher,
            },
            {
                id: snowflake.generate(),
                name: 'Luz Maria',
                username: 'luz',
                role: RoleFlags.Admin,
            },
            {
                id: snowflake.generate(),
                name: 'Andres Eli Maciel Muniz',
                username: 'eli',
                role: RoleFlags.Admin,
            },
            {
                id: snowflake.generate(),
                name: 'Lizeth Hernandez Jimenez',
                username: 'liz',
                role: RoleFlags.Admin,
            },
            {
                id: snowflake.generate(),
                name: 'Angeles Meyli Tea',
                username: 'tea',
                role: RoleFlags.Anonymous,
            },
        ],
    })
}
