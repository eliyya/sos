import { Laboratory, LABORATORY_TYPE, STATUS } from '@/prisma/browser'
import { atom } from 'jotai'

export const queryAtom = atom('')
export const editDialogAtom = atom(false)
export const entityToEditAtom = atom<
    Omit<Laboratory, 'created_at' | 'updated_at'>
>({
    id: '',
    name: '',
    open_hour: 0,
    close_hour: 0,
    type: LABORATORY_TYPE.LABORATORY,
    status: STATUS.ACTIVE,
})
export const updateAtom = atom(Symbol())
export const showArchivedAtom = atom(false)
export const openArchiveAtom = atom(false)
export const openUnarchiveAtom = atom(false)
export const openDeleteAtom = atom(false)
export const openCreateAtom = atom(false)
export const openUnarchiveOrDeleteAtom = atom(false)

// create
export const nameAtom = atom('')
export const errorNameAtom = atom('')
export const openHourAtom = atom('08:00')
export const errorOpenHourAtom = atom('')
export const closeHourAtom = atom('20:00')
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
