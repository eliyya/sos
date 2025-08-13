import { defineConfig } from 'prisma/config'
import { existsSync } from 'node:fs'
import path from 'node:path'

// load .env
if (existsSync('.env')) process.loadEnvFile()

export default defineConfig({
    schema: path.join('src', 'prisma', 'schema.prisma'),
    migrations: {
        seed: `node src/prisma/seed.ts`,
    },
})
