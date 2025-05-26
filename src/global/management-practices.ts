import { ScheduleEvent } from '@/types/schedule'
import { atom } from 'jotai'

export enum DialogMode {
    INFO,
    EDIT,
    DELETE,
}

export const openCreateAtom = atom(false)
/**
 * This atom is used to store the start hour of the event in miliseconds timestamp format
 */
export const createDayAtom = atom(0)
export const actualEventAtom = atom<ScheduleEvent>({
    color: '#1f086e',
    end: 0,
    start: 0,
    id: '',
    ownerId: '',
})
export const newEventSignalAtom = atom(Symbol())
export const eventsAtom = atom<ScheduleEvent[]>([])
export const eventInfoAtom = atom<ScheduleEvent | null>(null)
export const modeAtom = atom<DialogMode>(DialogMode.INFO)
