import { PrismaClient } from '@prisma/client'
import { SnowFlakeGenerator } from '../classes/SnowFlake.ts'

function createPrismaClient() {
    return new PrismaClient()
}

declare const globalThis: {
    dbGlobal: ReturnType<typeof createPrismaClient>
    snowflake: SnowFlakeGenerator
} & typeof global

const db = globalThis.dbGlobal ?? createPrismaClient()
const snowflake = globalThis.snowflake ?? new SnowFlakeGenerator()

if (process.env.NODE_ENV !== 'production') {
    globalThis.dbGlobal = db
    globalThis.snowflake = snowflake
}

export { db, snowflake }
