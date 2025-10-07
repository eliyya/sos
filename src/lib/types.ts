import { auth } from '@/lib/auth'

export type CompleteSession = typeof auth.$Infer.Session
export type UserSession = CompleteSession['user']
export type Serializable<T> = {
    [K in keyof T]: T[K] extends bigint ? string : T[K]
}

export type Branded<T extends Record<string, bigint>> = {
    [K in keyof T]: T[K] & { __tag: K }
}
export function brandFlags<T extends Record<string, bigint>>(value: T) {
    return Object.freeze(value) as Branded<Readonly<T>>
}
export type KeysBrand<T extends Record<string, bigint>> = T[keyof T]
