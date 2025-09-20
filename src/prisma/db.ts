import { PrismaClient } from '@prisma/client'
import { Context, Layer } from 'effect'

function createPrismaClient() {
    return new PrismaClient()
}

declare const globalThis: {
    dbGlobal: ReturnType<typeof createPrismaClient>
} & typeof global

const db = globalThis.dbGlobal ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.dbGlobal = db

export { db }

export class PrismaService extends Context.Tag('PrismaService')<
    PrismaService,
    PrismaClient
>() {}

export const PrismaLive = Layer.succeed(PrismaService, db)
