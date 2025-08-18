import { Laboratory } from '@prisma/client'
import { LABORATORY_TYPE, STATUS } from '@prisma/client'
import { atom } from 'jotai'
import {
    Clock12Icon,
    Clock1Icon,
    Clock2Icon,
    Clock3Icon,
    Clock4Icon,
    Clock5Icon,
    Clock6Icon,
    Clock7Icon,
    Clock8Icon,
    Clock9Icon,
    Clock10Icon,
    Clock11Icon,
} from 'lucide-react'

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

export const CLOCK_ICONS = {
    '00:00': Clock12Icon,
    '01:00': Clock1Icon,
    '02:00': Clock2Icon,
    '03:00': Clock3Icon,
    '04:00': Clock4Icon,
    '05:00': Clock5Icon,
    '06:00': Clock6Icon,
    '07:00': Clock7Icon,
    '08:00': Clock8Icon,
    '09:00': Clock9Icon,
    '10:00': Clock10Icon,
    '11:00': Clock11Icon,
    '12:00': Clock12Icon,
    '13:00': Clock1Icon,
    '14:00': Clock2Icon,
    '15:00': Clock3Icon,
    '16:00': Clock4Icon,
    '17:00': Clock5Icon,
    '18:00': Clock6Icon,
    '19:00': Clock7Icon,
    '20:00': Clock8Icon,
    '21:00': Clock9Icon,
    '22:00': Clock10Icon,
    '23:00': Clock11Icon,
}
export type Hours = keyof typeof CLOCK_ICONS
export type ClockIcons = (typeof CLOCK_ICONS)[Hours]
