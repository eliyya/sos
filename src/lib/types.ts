import { auth } from '@/lib/auth'

export type CompleteSession = typeof auth.$Infer.Session
export type UserSession = CompleteSession['user']
