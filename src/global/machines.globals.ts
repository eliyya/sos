import { createSerializableLocaleStorage } from '@/lib/utils'
import { Machine } from '@/prisma/generated/browser'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const machinesAtom = atomWithStorage<Machine[]>(
    'machines',
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
type id = Machine['id']
export const selectedMachineIdAtom = atomWithStorage<id>(
    'selectedMachineId',
    '',
)
export const selectedMachineAtom = atom(get => {
    const machines = get(machinesAtom)
    const selectedId = get(selectedMachineIdAtom)
    return machines.find(machine => machine.id === selectedId)
})
