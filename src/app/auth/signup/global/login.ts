import { atom } from 'jotai'

export const LoginDialogAtom = atom(false)
export const usernameAtom = atom('')
export const usernameErrorAtom = atom('')
export const passwordAtom = atom('')
export const passwordErrorAtom = atom('')
export const passwordFocusAtom = atom(false)
export const confirmPasswordAtom = atom('')
export const confirmPasswordErrorAtom = atom('')
export const nameAtom = atom('')
export const nameErrorAtom = atom('')
export const canSuggestUsernameAtom = atom(true)
