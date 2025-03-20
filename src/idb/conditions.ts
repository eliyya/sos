import { idb, snowflake } from '../idb'
import { ConditionForIDB } from '../types'

export async function getAllConditions() {
    return await idb.conditions.toArray()
}

export async function setConditions(conditions: ConditionForIDB[]) {
    await idb.conditions.clear()
    await idb.conditions.bulkPut(conditions)
}

export async function addCondition(condition: string) {
    condition = condition.toLowerCase()
    const conditions = await idb.conditions
        .where('condition')
        .equals(condition)
        .first()
    if (conditions) return conditions
    const ncon: ConditionForIDB = {
        id: snowflake.generateCondition(),
        condition,
        sync: false,
    }
    await idb.conditions.put(ncon)
    return ncon
}

export async function getDefaultCondition() {
    const condition = await idb.conditions.toCollection().first()
    if (condition) return condition
    return await addCondition('new')
}

export async function clearUnusedConditions() {
    const drafts = await idb.property_drafts.toArray()
    const conditions = await idb.conditions.toArray()
    const { unused = [], used = [] } = Object.groupBy(conditions, c =>
        !c.sync && !drafts.some(d => d.condition_id === c.id) ?
            'unused'
        :   'used',
    )
    await idb.conditions.clear()
    await idb.conditions.bulkPut(used)
    return unused
}
