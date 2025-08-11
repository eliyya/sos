process.loadEnvFile()
import { PermissionsFlags } from '../bitfields/PermissionsBitField.ts'
import { SnowFlakeGenerator } from '../classes/SnowFlake.ts'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()
const snowflake = new SnowFlakeGenerator()

await db.role.create({
    data: {
        id: snowflake.generate(),
        name: 'admin',
        permissions: PermissionsFlags.ADMIN,
    },
})
await db.role.create({
    data: {
        id: snowflake.generate(),
        name: 'teacher',
        permissions: PermissionsFlags.SESSION_SELF,
    },
})
