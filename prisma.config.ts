import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
    schema: path.join('src', 'prisma', 'schema.prisma'),
    migrations: {
        seed: `node src/prisma/seed.ts`,
    },
})
