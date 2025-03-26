import { STATUS, User } from '@prisma/client'
import { atom } from 'jotai'

export const queryAtom = atom('')
export const EditUserDialogAtom = atom(false)
export const userToEditAtom = atom<User>({
    name: '',
    id: '',
    role: 0n,
    created_at: new Date(),
    username: '',
    status: STATUS.DELETED,
})
export const updateUsersAtom = atom<symbol>(Symbol())
