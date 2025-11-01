import { createSerializableLocaleStorage } from '@/lib/utils'
import { User, STATUS, Role } from '@/prisma/generated/browser'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const default_user: Omit<User, 'updated_at' | 'image'> = {
    name: '',
    id: '',
    created_at: new Date(),
    username: '',
    status: STATUS.DELETED,
    display_username: '',
    role_id: '',
    email: '',
    email_verified: false,
}
export const usersAtom = atomWithStorage<User[]>(
    'users',
    [],
    createSerializableLocaleStorage(),
)
export const dialogOpenedAtom = atom<
    | 'create'
    | 'edit'
    | 'archive'
    | 'unarchive'
    | 'delete'
    | 'unarchiveOrDelete'
    | 'preventArchiveAdmin'
    | null
>(null)
export const entityToEditAtom = atom(default_user)

export const adminRoleAtom = atom<Role | null>(null)
export const passwordFocusAtom = atom(false)
