import { createSerializableLocaleStorage } from '@/lib/utils'
import { Laboratory, LABORATORY_TYPE } from '@/prisma/generated/browser'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const laboratoriesAtom = atomWithStorage<Laboratory[]>(
    'laboratories',
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
// edit
type id = Laboratory['id']
export const selectedLaboratoryIdAtom = atomWithStorage<id>(
    'selectedLaboratoryId',
    '',
)
export const selectedLaboratoryAtom = atom(get => {
    const laboratories = get(laboratoriesAtom)
    const selectedId = get(selectedLaboratoryIdAtom)
    return laboratories.find(laboratory => laboratory.id === selectedId)
})
