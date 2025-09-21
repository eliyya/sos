import { PrismaClient } from '@prisma/client'

function createPrismaClient() {
    return new PrismaClient()
}

declare const globalThis: {
    dbGlobal: ReturnType<typeof createPrismaClient>
} & typeof global

const db = globalThis.dbGlobal ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.dbGlobal = db

export { db }
