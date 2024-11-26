import { PrismaClient } from '@prisma/client'

declare const globalThis: {
    dbGlobal: PrismaClient
} & typeof global

const db = globalThis.dbGlobal ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.dbGlobal = db

export { db }
