import { Subject } from '@/prisma/client'
import { STATUS } from '@/prisma/client/enums'
import { atom } from 'jotai'

export const queryAtom = atom('')
export const editDialogAtom = atom(false)
export const subjectToEditAtom = atom<
    Omit<Subject, 'created_at' | 'updated_at'>
>({
    name: '',
    id: '',
    practice_hours: 0,
    theory_hours: 0,
    status: STATUS.ACTIVE,
})
export const updateAtom = atom(Symbol())
export const openArchiveAtom = atom(false)
export const showArchivedAtom = atom(false)
export const openUnarchiveAtom = atom(false)
export const openDeleteAtom = atom(false)
export const openCreateAtom = atom(false)
