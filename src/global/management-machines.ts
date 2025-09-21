import { Laboratory, Machine , MACHINE_STATUS } from '@prisma/client'
import { atom } from 'jotai'

const defaultEntity: Omit<Machine, 'created_at' | 'updated_at'> = {
    number: 0,
    id: '',
    status: MACHINE_STATUS.AVAILABLE,
    processor: '',
    ram: '',
    storage: '',
    description: '',
    laboratory_id: null,
    serie: null,
}

export const queryAtom = atom('')
export const editDialogAtom = atom(false)
export const entityToEditAtom = atom(defaultEntity)
export const updateAtom = atom(Symbol())
export const showArchivedAtom = atom(false)
export const openArchiveAtom = atom(false)
export const openUnarchiveAtom = atom(false)
export const openDeleteAtom = atom(false)
export const openCreateAtom = atom(false)
export const openUnarchiveOrDeleteAtom = atom(false)
export const laboratoriesAtom = atom<Laboratory[]>([])
