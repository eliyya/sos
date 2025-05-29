'use server'

import { db } from '@/prisma/db'

export default async function getSchema() {
    const tables: { table_name: string; column_name: string }[] =
        await db.$queryRaw`
SELECT table_name, column_name
FROM information_schema.columns
WHERE table_schema = 'general'
AND table_name NOT LIKE '_prisma_%'
ORDER BY table_name, ordinal_position;
    `
    console.table(tables)

    return tables
}

export async function runQuery(query: string) {
    const result = await db.$queryRawUnsafe(query)

    return result
}
