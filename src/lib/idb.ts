'use client'

import Dexie, { Table } from 'dexie'
import {
    CategoryForIDB,
    ConditionForIDB,
    EmployeeForIDB,
    PropertyForIDB,
} from './types'
import { SnowFlakeGenerator } from './SnowFlake'

class IndexDataBase extends Dexie {
    property_drafts!: Table<PropertyForIDB>
    user!: Table<EmployeeForIDB>
    categories!: Table<CategoryForIDB>
    conditions!: Table<ConditionForIDB>

    constructor() {
        super('lm14cms_database')
        this.version(1).stores({
            property_drafts: 'id', // 'id' como clave primaria
            user: 'id',
            categories: 'id, category',
            conditions: 'id, condition',
        })
    }
}

function createDatabase() {
    return new IndexDataBase()
}

declare const globalThis: {
    idbGlobal: ReturnType<typeof createDatabase>
    snowflake: SnowFlakeGenerator
} & typeof global

const idb = globalThis.idbGlobal ?? createDatabase()
const snowflake = globalThis.snowflake ?? new SnowFlakeGenerator()

if (process.env.NODE_ENV !== 'production') {
    globalThis.idbGlobal = idb
    globalThis.snowflake = snowflake
}

export { idb, snowflake }
