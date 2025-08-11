import { User } from '@prisma/client'
import { STATUS } from '@prisma/client'
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
export const userToEditAtom = atom(default_user)
export const updateUsersAtom = atom(Symbol())
export const openArchiveUserAtom = atom(false)
export const showArchivedAtom = atom(false)
export const openUnarchiveUserAtom = atom(false)
export const openDeleteUserAtom = atom(false)
export const openCreateUserAtom = atom(false)
