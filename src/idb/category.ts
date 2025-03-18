import { idb, snowflake } from '../idb'
import { CategoryForIDB } from '../types'

export async function getAllCategories() {
    return await idb.categories.toArray()
}

export async function setCategories(categories: CategoryForIDB[]) {
    await idb.categories.clear()
    await idb.categories.bulkPut(categories)
}

export async function addCategory(category: string) {
    category = category.toLowerCase()
    const categories = await idb.categories
        .where('category')
        .equals(category)
        .first()
    if (categories) return categories
    const ncat: CategoryForIDB = {
        id: snowflake.generateCategory(),
        category,
        sync: false,
    }
    await idb.categories.put(ncat)
    return ncat
}

export async function getDefaultCategory() {
    const category = await idb.categories.toCollection().first()
    if (category) return category
    return await addCategory('house')
}

export async function clearUnusedCategories() {
    const drafts = await idb.property_drafts.toArray()
    const categories = await idb.categories.toArray()
    const { unused = [], used = [] } = Object.groupBy(categories, c =>
        !c.sync && !drafts.some(d => d.category_id === c.id) ?
            'unused'
        :   'used',
    )
    await idb.categories.clear()
    await idb.categories.bulkPut(used)
    return unused
}
