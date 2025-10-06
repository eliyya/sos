import { Career, STATUS } from '@/prisma/generated/browser'
import { atom } from 'jotai'

export const queryAtom = atom('')
export const editDialogAtom = atom(false)
export const entityToEditAtom = atom<Omit<Career, 'created_at' | 'updated_at'>>(
    {
        name: '',
        id: '',
        alias: '',
        status: STATUS.ACTIVE,
    },
)
export const updateAtom = atom(Symbol())
export const showArchivedAtom = atom(false)
export const openArchiveAtom = atom(false)
export const openUnarchiveAtom = atom(false)
export const openDeleteAtom = atom(false)
export const openCreateAtom = atom(false)
export const openUnarchiveOrDeleteAtom = atom(false)
