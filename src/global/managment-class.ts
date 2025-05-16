import { Class } from '@prisma/client'
import { STATUS } from '@/prisma/client/enums'
import { atom } from 'jotai'

export const queryAtom = atom('')
export const editDialogAtom = atom(false)
export const entityToEditAtom = atom<Omit<Class, 'created_at' | 'updated_at'>>({
    id: '',
    subject_id: '',
    teacher_id: '',
    career_id: '',
    status: STATUS.ACTIVE,
})
export const updateAtom = atom(Symbol())
export const showArchivedAtom = atom(false)
export const openArchiveAtom = atom(false)
export const openUnarchiveAtom = atom(false)
export const openDeleteAtom = atom(false)
export const openCreateAtom = atom(false)
