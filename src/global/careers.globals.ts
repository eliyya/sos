import { atomWithStorage } from 'jotai/utils'
import { Career } from '@/prisma/generated/browser'
import { createSerializableLocaleStorage } from '@/lib/utils'
import { atom } from 'jotai'

export const careersAtom = atomWithStorage<Career[]>(
    'careers',
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
type id = Career['id']
export const selectedCareerIdAtom = atomWithStorage<id>('selectedCareerId', '')
export const selectedCareerAtom = atom(get => {
    const careers = get(careersAtom)
    const selectedId = get(selectedCareerIdAtom)
    return careers.find(career => career.id === selectedId)
})
