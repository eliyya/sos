import { createSerializableLocaleStorage } from '@/lib/utils'
import { Role, User, STATUS } from '@/prisma/generated/browser'
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
export const queryAtom = atom('')
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
export const showArchivedAtom = atom(false)
export const usernameAtom = atom('')
export const usernameErrorAtom = atom('')
export const canSuggestUsernameAtom = atom(false)
export const nameAtom = atom('')
export const nameErrorAtom = atom('')
export const passwordAtom = atom('')
export const passwordErrorAtom = atom('')
export const passwordFocusAtom = atom(false)
export const confirmPasswordAtom = atom('')
export const confirmPasswordErrorAtom = atom('')
export const editPasswordAtom = atom('')
export const editPasswordErrorAtom = atom('')
export const editConfirmPasswordAtom = atom('')
export const editConfirmPasswordErrorAtom = atom('')
export const adminRoleAtom = atom<Role | null>(null)
