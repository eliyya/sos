import { Subject, STATUS } from '@prisma/client'
import { atom } from 'jotai'

const defaultEntity: Omit<Subject, 'created_at' | 'updated_at'> = {
    name: '',
    id: '',
    practice_hours: 0,
    theory_hours: 0,
    status: STATUS.ACTIVE,
}

export const queryAtom = atom('')
export const entityToEditAtom = atom(defaultEntity)
export const updateAtom = atom(Symbol())
export const showArchivedAtom = atom(false)

// create
export const nameAtom = atom('')
export const errorNameAtom = atom('')

// open
export const openCreateAtom = atom(false)
export const openEditDialogAtom = atom(false)
export const openArchiveAtom = atom(false)
export const openUnarchiveAtom = atom(false)
export const openDeleteAtom = atom(false)
export const openUnarchiveOrDeleteAtom = atom(false)
