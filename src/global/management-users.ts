import { User } from '@prisma/client'
import { STATUS } from '@prisma/client'
import { atom } from 'jotai'

export const queryAtom = atom('')
export const EditUserDialogAtom = atom(false)
export const userToEditAtom = atom<Omit<User, 'updated_at'>>({
    name: '',
    id: '',
    role: 0n,
    created_at: new Date(),
    username: '',
    status: STATUS.DELETED,
})
export const updateUsersAtom = atom(Symbol())
export const openArchiveUserAtom = atom(false)
export const showArchivedAtom = atom(false)
export const openUnarchiveUserAtom = atom(false)
export const openDeleteUserAtom = atom(false)
export const openCreateUserAtom = atom(false)
