import { getClasses } from '@/actions/classes.actions'
import { createSerializableLocaleStorage } from '@/lib/utils'
import { Class } from '@/prisma/generated/browser'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

type Classes = Awaited<ReturnType<typeof getClasses>>
export const classesAtom = atomWithStorage<Classes>(
    'classes',
    [],
    createSerializableLocaleStorage(),
)
// dialogs
export const openDialogAtom = atom<
    | 'CREATE'
    | 'EDIT'
    | 'DELETE'
    | 'ARCHIVE'
    | 'UNARCHIVE'
    | 'UNARCHIVE_OR_DELETE'
    | null
>(null)
// edit
type id = Class['id']
export const selectedClassIdAtom = atomWithStorage<id>('selectedClassId', '')
export const selectedClassAtom = atom(get => {
    const classes = get(classesAtom)
    const selectedId = get(selectedClassIdAtom)
    return classes.find(student => student.id === selectedId)
})
