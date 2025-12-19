import { atom } from 'jotai'
import { ScheduleEvent } from '@/types/schedule'
import { getPracticesFromWeekAction } from '@/actions/reservations.actions'

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
export const eventInfoAtom = atom<ScheduleEvent | null>(null)
export const modeAtom = atom<DialogMode>(DialogMode.INFO)
export const selectedUserAtom = atom({
    name: '',
    id: '',
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const classesAtom = atom<any[]>([]) // TODO: fix type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectedClassAtom = atom<any | null>(null) // TODO: fix type
export const remainingHoursAtom = atom({
    leftHours: Infinity,
    allowedHours: 0,
    usedHours: 0,
})
// -----------
// anonimous
// -----------
export const reservationsAtom = atom<
    Awaited<ReturnType<typeof getPracticesFromWeekAction>>
>([])
// -----------
// all
// -----------
export const eventsAtom = atom<ScheduleEvent[]>(get =>
    get(reservationsAtom).map(e => ({
        id: e.id,
        title: e.name,
        start: e.starts_at.getTime(),
        end: e.ends_at.getTime(),
        ownerId: e.teacher_id,
    })),
)
