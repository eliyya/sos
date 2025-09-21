import { auth } from '@/lib/auth'

export type CompleteSession = typeof auth.$Infer.Session
export type UserSession = CompleteSession['user']
export type Serializable<T> = {
    [K in keyof T]: T[K] extends bigint ? string : T[K]
}
