import { Role, User , STATUS } from '@prisma/client'
import { atom } from 'jotai'

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
export const queryAtom = atom('')
export const EditUserDialogAtom = atom(false)
export const entityToEditAtom = atom(default_user)
export const updateAtom = atom(Symbol())
export const openArchiveUserAtom = atom(false)
export const showArchivedAtom = atom(false)
export const openUnarchiveUserAtom = atom(false)
export const openDeleteAtom = atom(false)
export const openCreateUserAtom = atom(false)
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
export const openUnarchiveOrDeleteAtom = atom(false)
export const openPreventArchiveAdminAtom = atom(false)
export const adminRoleAtom = atom<Role | null>(null)
export const rolesAtom = atom<Role[]>([])
