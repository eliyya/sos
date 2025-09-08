import { Student } from '@prisma/client'
import { STATUS } from '@prisma/client'
import { atom } from 'jotai'

export const queryAtom = atom('')
export const editDialogAtom = atom(false)
export const entityToEditAtom = atom<
    Omit<Student, 'created_at' | 'updated_at'>
>({
    nc: '',
    lastname: '',
    firstname: '',
    semester: 0,
    career_id: '',
    status: STATUS.ACTIVE,
    group: 1,
})
export const updateAtom = atom(Symbol())
export const showArchivedAtom = atom(false)
export const openArchiveAtom = atom(false)
export const openUnarchiveAtom = atom(false)
export const openDeleteAtom = atom(false)
export const openCreateAtom = atom(false)
export const openUnarchiveOrDeleteAtom = atom(false)
