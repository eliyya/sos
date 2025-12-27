import { create } from 'zustand'
import { Temporal } from '@js-temporal/polyfill'

type FormInputs = {
    name: string
    topic: string
    start: string
    duration: string
    students: string
}
type Errored<T> = {
    [K in keyof T as K extends string ? `${K}Error` : never]?: T[K]
}
type FormStore = {
    date: number | null
    setDate: (date: number | null) => void
    set: (value: Partial<FormInputs>) => void
    reset: () => void
    error: (error: Partial<FormInputs>) => void
} & FormInputs &
    Errored<FormInputs>

export const useFormReserveStore = create<FormStore>()(set => ({
    name: '',
    topic: '',
    start: '',
    duration: '1',
    students: '1',
    date: null,
    setDate: date => {
        if (!date) {
            set({ date: null })
            return
        }
        const time = Temporal.Instant.fromEpochMilliseconds(date)
            .toZonedDateTimeISO('America/Monterrey')
            .with({
                minute: 0,
                second: 0,
                millisecond: 0,
            })
        const start = time.toPlainTime().toLocaleString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
        set({
            date: time.epochMilliseconds,
            start,
        })
    },
    set: value => {
        set(() => value)
        Object.keys(value).forEach(k => set({ [`${k}Error`]: '' }))
    },
    reset: () => set(() => ({ name: '' })),
    error: error => {
        for (const [k, v] of Object.entries(error)) {
            set(() => ({ [`${k}Error`]: v }))
        }
    },
}))
