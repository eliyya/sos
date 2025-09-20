import { Role } from '@prisma/client'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { Serializable } from '@/lib/types'

type id = Role['id']
export const queryAtom = atom('')
export const rolesAtom = atomWithStorage<Serializable<Role>[]>('roles', [])
export const selectedRoleIdAtom = atomWithStorage<id>('selectedRoleId', '')
export const selectedRoleAtom = atom(get => {
    const roles = get(rolesAtom)
    const selectedId = get(selectedRoleIdAtom)
    return roles.find(role => role.id === selectedId) ?? roles.at(0)
})
export const updateAtom = atom(Symbol())
export const openDeleteAtom = atom(false)
