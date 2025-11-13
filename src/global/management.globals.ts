import { PermissionsBitField } from '@/bitfields/PermissionsBitField'
import { createSerializableLocaleStorage } from '@/lib/utils'
import { Role } from '@/prisma/generated/browser'
import app from '@eliyya/type-routes'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// dialogs
export const dialogAtom = atom<
    | 'CREATE'
    | 'EDIT'
    | 'DELETE'
    | 'ARCHIVE'
    | 'UNARCHIVE'
    | 'UNARCHIVE_OR_DELETE'
    | 'PREVENT_ARCHIVE_ADMIN'
    | null
>(null)
// select
export const selectedIdAtom = atomWithStorage('selected', '')
type selectOption = {
    label: string
    value: string
}
// select options
export const careersSelectOptionsAtom = atomWithStorage<selectOption[]>(
    'careersSelectOptions',
    [],
)
export const subjectsSelectOptionsAtom = atomWithStorage<selectOption[]>(
    'subjectsSelectOptions',
    [],
)
export const usersSelectOptionsAtom = atomWithStorage<selectOption[]>(
    'usersSelectOptions',
    [],
)
export const laboratoriesSelectOptionsAtom = atomWithStorage<selectOption[]>(
    'laboratoriesSelectOptions',
    [],
)
export const classesSelectOptionsAtom = atomWithStorage<selectOption[]>(
    'classesSelectOptions',
    [],
)
// routes
export const managementRouteSelected = atomWithStorage<string>(
    'managementRouteSelected',
    app.$locale.dashboard.management.laboratories('es'),
)
// roles
// TODO: implement roles
export const rolesAtom = atomWithStorage<Role[]>(
    'roles',
    [],
    createSerializableLocaleStorage(),
)
export const selectedRoleIdAtom = atomWithStorage('selectedRoleId', '')
export const selectedRoleAtom = atom(get => {
    const roles = get(rolesAtom)
    const selectedId = get(selectedRoleIdAtom)
    return roles.find(role => role.id === selectedId) ?? roles.at(0)
})
export const updateAtom = atom(Symbol())
export const openDeleteAtom = atom(false)
export const permissionsEditedAtom = atom(new PermissionsBitField())
export const usersCountAtom = atomWithStorage<
    { id: Role['id']; count: number }[]
>('usersCount', [])
