import { createSerializableLocaleStorage } from '@/lib/utils'
import { Student } from '@/prisma/generated/browser'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const studentsAtom = atomWithStorage<Student[]>(
    'students',
    [],
    createSerializableLocaleStorage(),
)
// filters
export const queryAtom = atom('')
export const showArchivedAtom = atom(false)
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
// edit
type nc = Student['nc']
export const selectedStudentNCAtom = atomWithStorage<nc>(
    'selectedStudentNC',
    '',
)
export const selectedStudentAtom = atom(get => {
    const students = get(studentsAtom)
    const selectedNC = get(selectedStudentNCAtom)
    return students.find(student => student.nc === selectedNC)
})
