import { ScheduleEvent } from '@/types/schedule'
import { EventInput } from '@fullcalendar/core/index.js'
import { atom } from 'jotai'

export const openCreateAtom = atom(false)
/**
 * This atom is used to store the start hour of the event in miliseconds timestamp format
 */
export const createDayAtom = atom(0)
export const actualEventAtom = atom<EventInput>({ color: '#1f086e' })
export const newEventSignalAtom = atom(Symbol())
export const eventsAtom = atom<ScheduleEvent[]>([])
