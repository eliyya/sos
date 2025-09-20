import { atom } from 'jotai'
import { type getClassesWithDataFromUser } from '@/actions/class'
import { ScheduleEvent } from '@/types/schedule'

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
export const selectedUserAtom = atom({
    name: '',
    id: '',
})
export type ClassForSelect = Awaited<
    ReturnType<typeof getClassesWithDataFromUser<['subject', 'career']>>
>[number]
export const classesAtom = atom<ClassForSelect[]>([])
export const selectedClassAtom = atom<ClassForSelect | null>(null)
export const remainingHoursAtom = atom({
    leftHours: Infinity,
    allowedHours: 0,
    usedHours: 0,
})
