import { PrismaClient } from '@/prisma/client'
import {
    DB_STATES,
    DEFAULT_PERMISSIONS,
    DEFAULT_ROLES,
} from '../constants/client.ts'

const db = new PrismaClient()

await db.role.create({
    data: {
        name: DEFAULT_ROLES.ADMIN,
        permissions: DEFAULT_PERMISSIONS.ADMIN,
    },
})
await db.role.create({
    data: {
        name: DEFAULT_ROLES.USER,
        permissions: DEFAULT_PERMISSIONS.USER,
    },
})
await db.role.create({
    data: {
        name: DEFAULT_ROLES.DELETED,
        permissions: DEFAULT_PERMISSIONS.DELETED,
    },
})
await db.states.create({
    data: {
        name: DB_STATES.ROLES_COUNT,
        value: 3,
    },
})
