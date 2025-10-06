import { createSerializableLocaleStorage } from '@/lib/utils'
import { Laboratory, LABORATORY_TYPE } from '@/prisma/client'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const laboratoriesAtom = atomWithStorage<Laboratory[]>(
    'laboratories',
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
// create
export const nameAtom = atom('')
export const errorNameAtom = atom('')
export const openHourAtom = atom('')
export const errorOpenHourAtom = atom('')
export const closeHourAtom = atom('')
export const errorCloseHourAtom = atom('')
const defaultTypeAtom: {
    value: LABORATORY_TYPE
    label: string
} = {
    value: LABORATORY_TYPE.LABORATORY,
    label: 'Laboratorio',
}
export const typeAtom = atom(defaultTypeAtom)
export const errorTypeAtom = atom('')
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
