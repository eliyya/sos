import { Software } from '@/prisma/client'
import { atom } from 'jotai'

export const queryAtom = atom('')
export const editDialogAtom = atom(false)
export const entityToEditAtom = atom<
    Omit<Software, 'created_at' | 'updated_at'>
>({ id: '', name: '' })
export const updateAtom = atom(Symbol())
export const openDeleteAtom = atom(false)
export const openCreateAtom = atom(false)
