import { createSerializableLocaleStorage } from '@/lib/utils'
import { User, Role } from '@/prisma/generated/browser'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

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
type id = User['id']
export const selectedUserIdAtom = atomWithStorage<id>('selectedUserId', '')
export const adminRoleAtom = atom<Role | null>(null)
export const passwordFocusAtom = atom(false)
