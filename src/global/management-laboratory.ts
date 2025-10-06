import { Laboratory, LABORATORY_TYPE, STATUS } from '@/prisma/browser'
import { atom } from 'jotai'

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
