import { atom } from 'jotai'

export const queryAtom = atom('SELECT * FROM practices')
export const queryResultAtom = atom<object[]>([])
export const queryErrorAtom = atom('')
