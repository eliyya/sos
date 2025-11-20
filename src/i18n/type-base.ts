import { watch, writeFile, readFileSync } from 'node:fs'

if (process.argv.includes('--watch')) {
    console.log('Watching locales for changes...')
    watch('./locales/es.json', { persistent: true }, async () => {
        save()
    })
}

save()

async function save() {
    setTimeout(() => {
        const messages = readFileSync(`./locales/es.json`, 'utf-8')
        const json = JSON.parse(messages)
        writeFile(
            './src/i18n/types.ts',
            `export type BaseMessage = ${JSON.stringify(json, null, 4)}`,
            err => {
                if (err) {
                    console.error('Error writing file', err)
                }
            },
        )
        console.log('Wrote types to src/i18n/types.ts')
    }, 500)
}
