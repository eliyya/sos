import { Career, Class, STATUS, Subject, User } from '@/prisma/browser'
import { atom } from 'jotai'

const defaultEntity: Omit<Class, 'created_at' | 'updated_at'> = {
    id: '',
    subject_id: '',
    teacher_id: '',
    career_id: '',
    group: 0,
    semester: 0,
    status: STATUS.ACTIVE,
}

export const queryAtom = atom('')
export const entityToEditAtom = atom(defaultEntity)
export const updateAtom = atom(Symbol())
export const showArchivedAtom = atom(false)
export const careersAtom = atom<Career[]>([])
export const subjectsAtom = atom<Subject[]>([])
export const usersAtom = atom<User[]>([])

// open
export const editDialogAtom = atom(false)
export const openArchiveAtom = atom(false)
export const openUnarchiveAtom = atom(false)
export const openDeleteAtom = atom(false)
export const openCreateAtom = atom(false)
export const openUnarchiveOrDeleteAtom = atom(false)

// create
export const nameAtom = atom('')
export const errorNameAtom = atom('')
