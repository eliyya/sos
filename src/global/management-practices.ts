import { EventInput } from '@fullcalendar/core/index.js'
import { atom } from 'jotai'

export const openCreateAtom = atom(false)
export const createDayAtom = atom(new Date())
export const actualEventAtom = atom<EventInput>({ color: '#1f086e' })
