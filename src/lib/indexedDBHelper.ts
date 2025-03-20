import { PUBLISH_STATUS } from '@prisma/client'
import { idb, snowflake } from './idb'
import { EmployeeForIDB, PropertyForIDB } from './types'
import { getDefaultCategory } from './idbHelpers/category'
import { getDefaultCondition } from './idbHelpers/conditions'

export async function createDraft() {
    const category = await getDefaultCategory()
    const condition = await getDefaultCondition()
    const property: PropertyForIDB = {
        id: snowflake.generateProperties(),
        title: '',
        description: '',
        public_property_registry: '',
        agent_id: '',
        bathrooms: 0,
        rooms: 0,
        parkings: 0,
        terrain_area: 0,
        construction_area: 0,
        private_area: 0,
        publish_status: PUBLISH_STATUS.DRAFT,
        created_at: Date.now(),
        category_id: category.id,
        condition_id: condition.id,
    }
    await saveProperty(property)
    return property
}

export async function saveProperty(property: Omit<PropertyForIDB, 'agent_id'>) {
    const user = await getUser()
    await idb.property_drafts.put({ ...property, agent_id: user!.id })
}

export async function getProperty(id: string) {
    return await idb.property_drafts.get(id)
}

export async function getAllProperties() {
    return await idb.property_drafts.toArray()
}

export async function saveUser(user: EmployeeForIDB) {
    await idb.user.put(user)
}

// Obtener información del usuario
export async function getUser() {
    return await idb.user.toCollection().first()
}

// Eliminar datos del usuario (logout)
export async function removeUser() {
    await idb.user.clear()
}
