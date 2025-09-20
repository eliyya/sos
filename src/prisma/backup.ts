/* eslint-disable @typescript-eslint/no-explicit-any */
process.loadEnvFile()

import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { CronJob } from 'cron'

import { db } from './db.ts'

const BACKUP_DIR = process.env.BACKUP_DIR ?? '.'

new CronJob(
    '0 0 1 1,7 *', // 1 de enero y 1 de julio a las 00:00
    () => {
        exportAllDynamic()
    },
    null,
    true, // start inmediatamente
    'America/Monterrey', // usa UTC para evitar problemas de zona horaria
)

async function exportAllDynamic() {
    mkdirSync(BACKUP_DIR, { recursive: true })

    // Obtenemos las propiedades del cliente prisma que son modelos
    const modelNames = Object.keys(db).filter(
        key => typeof (db as any)[key]?.findMany === 'function',
    )

    const data: Record<string, any> = {}

    for (const modelName of modelNames) {
        try {
            // Ejecutamos findMany en cada modelo
            data[modelName] = await (db as any)[modelName].findMany()
        } catch (error) {
            console.warn(`No se pudo exportar modelo ${modelName}:`, error)
        }
    }

    const backup = {
        timestamp: new Date().toISOString(),
        data,
    }

    const filePath = join(BACKUP_DIR, `backup_${Date.now()}.json`)
    writeFileSync(filePath, JSON.stringify(backup, null, 2), 'utf-8')

    console.log(`Backup JSON creado en: ${filePath}`)
}
