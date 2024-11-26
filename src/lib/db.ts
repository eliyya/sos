import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '@/lib/drizzle'
import postgres from 'postgres'

declare const globalThis: {
    drizzleGlobal: ReturnType<typeof drizzle<typeof schema>>
} & typeof global

const db =
    globalThis.drizzleGlobal ??
    drizzle({
        client: postgres(process.env.DATABASE_URL!),
        schema: schema,
    })

if (process.env.NODE_ENV !== 'production') globalThis.drizzleGlobal = db

export { db }
