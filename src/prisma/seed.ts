import { DEFAULT_ROLES } from '../constants/client.ts'
import { PermissionsFlags } from '../bitfields/PermissionsBitField.ts'
import { SnowFlakeGenerator } from '../classes/SnowFlake.ts'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()
const snowflake = new SnowFlakeGenerator()

await db.role.create({
    data: {
        id: snowflake.generate(),
        name: DEFAULT_ROLES.ADMIN,
        permissions: PermissionsFlags.ADMIN,
    },
})
await db.role.create({
    data: {
        id: snowflake.generate(),
        name: DEFAULT_ROLES.USER,
        permissions: PermissionsFlags.SESSION_SELF,
    },
})
await db.role.create({
    data: {
        id: snowflake.generate(),
        name: DEFAULT_ROLES.DELETED,
        permissions: 0n,
    },
})
