process.loadEnvFile()
import { auth } from '../lib/auth.ts'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()
// const snowflake = new SnowFlakeGenerator()

await db.user.deleteMany()
if (
    !process.env.FIRST_ADMIN_USERNAME ||
    !process.env.FIRST_ADMIN_NAME ||
    !process.env.FIRST_ADMIN_PASSWORD
)
    throw new Error('FIRST_ADMIN variables not found')

// await db.user.create({
//     data: {
//         id: snowflake.generate(),
//         name: process.env.FIRST_ADMIN_NAME,
//         username: process.env.FIRST_ADMIN_USERNAME,
//         role: 3,
//         email: `${process.env.FIRST_ADMIN_USERNAME}@noemail.local`,
//         // auths: {
//         //     create: {
//         //         id: snowflake.generate(),
//         //         password: await hash(process.env.FIRST_ADMIN_PASSWORD, 10),
//         //     },
//         // },
//     },
// })

await auth.api.signUpEmail({
    body: {
        email: `${process.env.FIRST_ADMIN_USERNAME}@noemail.local`, // user email address
        password: process.env.FIRST_ADMIN_PASSWORD,
        name: process.env.FIRST_ADMIN_NAME,
        username: process.env.FIRST_ADMIN_USERNAME,
    },
})

// if (process.env.NODE_ENV !== 'production') {
//     const [{ id: iscId }] = await db.career.createManyAndReturn({
//         data: [
//             {
//                 id: snowflake.generate(),
//                 name: 'Ingenieria en Sistemas Computacionales',
//                 alias: 'ISC',
//             },
//         ],
//     })
//     const [{ id: isId }, { id: rcId }, { id: ctnId }] =
//         await db.subject.createManyAndReturn({
//             data: [
//                 {
//                     id: snowflake.generate(),
//                     name: 'Ingeniería de Software',
//                     practice_hours: 3,
//                     theory_hours: 2,
//                 },
//                 {
//                     id: snowflake.generate(),
//                     name: 'Redes de Computadoras',
//                     practice_hours: 3,
//                     theory_hours: 2,
//                 },
//                 {
//                     id: snowflake.generate(),
//                     name: 'Conectividad con tecnologías de la nube',
//                     practice_hours: 3,
//                     theory_hours: 2,
//                 },
//             ],
//         })
//     const [{ id: guzmiId }, { id: larkinsId }] =
//         await db.user.createManyAndReturn({
//             data: [
//                 {
//                     id: snowflake.generate(),
//                     name: 'Juan Francisco Guzman',
//                     username: 'guzmi',
//                     role: RoleFlags.Teacher + RoleFlags.Admin,
//                     email: 'guzmi@noemail.local',
//                 },
//                 {
//                     id: snowflake.generate(),
//                     name: 'Ediberto Larkins',
//                     username: 'larkins',
//                     role: RoleFlags.Teacher,
//                     email: 'larkins@noemail.local',
//                 },
//             ],
//         })
//     await db.class.createMany({
//         data: [
//             {
//                 id: snowflake.generate(),
//                 career_id: iscId,
//                 subject_id: isId,
//                 teacher_id: guzmiId,
//                 group: 1,
//                 semester: 6,
//             },
//             {
//                 id: snowflake.generate(),
//                 career_id: iscId,
//                 subject_id: rcId,
//                 teacher_id: larkinsId,
//                 group: 1,
//                 semester: 6,
//             },
//             {
//                 id: snowflake.generate(),
//                 career_id: iscId,
//                 subject_id: ctnId,
//                 teacher_id: larkinsId,
//                 group: 1,
//                 semester: 6,
//             },
//         ],
//     })
//     await db.student.create({
//         data: {
//             career_id: iscId,
//             firstname: 'Lizeth',
//             lastname: 'Hernandez Jimenez',
//             nc: '22820079',
//             semester: 6,
//             group: 1,
//         },
//     })
//     await db.student.create({
//         data: {
//             career_id: iscId,
//             firstname: 'Andres Eli',
//             lastname: 'Maciel Muñiz',
//             nc: '22820082',
//             semester: 6,
//             group: 1,
//         },
//     })
// }
