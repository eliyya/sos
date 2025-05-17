import { Laboratory } from '@prisma/client'
import { LABORATORY_TYPE, STATUS } from '@prisma/client'
import { atom } from 'jotai'

export const queryAtom = atom('')
export const editDialogAtom = atom(false)
export const entityToEditAtom = atom<
    Omit<Laboratory, 'created_at' | 'updated_at'>
>({
    id: '',
    name: '',
    open_hour: 0,
    close_hour: 0,
    type: LABORATORY_TYPE.LABORATORY,
    status: STATUS.ACTIVE,
})
export const updateAtom = atom(Symbol())
export const showArchivedAtom = atom(false)
export const openArchiveAtom = atom(false)
export const openUnarchiveAtom = atom(false)
export const openDeleteAtom = atom(false)
export const openCreateAtom = atom(false)
