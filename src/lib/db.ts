import { drizzle } from 'drizzle-orm/vercel-postgres'
import * as schema from '@/lib/drizzle'
import { createClient } from '@vercel/postgres'

declare const globalThis: {
    drizzleGlobal: ReturnType<typeof drizzle<typeof schema>>
} & typeof global

const db =
    globalThis.drizzleGlobal ??
    drizzle(
        createClient({
            connectionString: process.env.DATABASE_URL!,
        }),
        { schema },
    )

if (process.env.NODE_ENV !== 'production') globalThis.drizzleGlobal = db

export { db }
