import { existsSync } from 'node:fs'
import path from 'node:path'

import { defineConfig } from 'prisma/config'

// load .env
if (existsSync('.env')) process.loadEnvFile()

export default defineConfig({
    schema: path.join('src', 'prisma', 'schema.prisma'),
    migrations: {
        seed: `node src/prisma/seed.ts`,
    },
})
