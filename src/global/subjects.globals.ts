import { createSerializableLocaleStorage } from '@/lib/utils'
import { Subject } from '@/prisma/generated/browser'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const subjectsAtom = atomWithStorage<Subject[]>(
    'subjects',
    [],
    createSerializableLocaleStorage(),
)
// dialogs
export const openDialogAtom = atom<
    | 'CREATE'
    | 'EDIT'
    | 'DELETE'
    | 'ARCHIVE'
    | 'UNARCHIVE'
    | 'UNARCHIVE_OR_DELETE'
    | null
>(null)
// create
export const nameAtom = atom('')
export const errorNameAtom = atom('')
export const openHourAtom = atom('')
export const errorOpenHourAtom = atom('')
export const closeHourAtom = atom('')
export const errorCloseHourAtom = atom('')
// edit
type id = Subject['id']
export const selectedSubjectIdAtom = atomWithStorage<id>(
    'selectedSubjectId',
    '',
)
export const selectedSubjectAtom = atom(get => {
    const subjects = get(subjectsAtom)
    const selectedId = get(selectedSubjectIdAtom)
    return subjects.find(subject => subject.id === selectedId)
})
