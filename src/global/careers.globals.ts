import { atomWithStorage } from 'jotai/utils'
import { Career } from '@/prisma/generated/browser'
import { createSerializableLocaleStorage } from '@/lib/utils'
import { atom } from 'jotai'

export const careersAtom = atomWithStorage<Career[]>(
    'careers',
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
type id = Career['id']
export const selectedCareerIdAtom = atomWithStorage<id>('selectedCareerId', '')
export const careersSelectOptionsAtom = atomWithStorage<
    {
        label: string
        value: string
    }[]
>('careersSelectOptions', [])
