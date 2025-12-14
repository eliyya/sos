import { Layer, Context } from 'effect'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const getSession = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return null
    return session
}

const getContext = async () => {
    const ctx = await auth.$context
    return ctx
}

const api = () => {
    const api = auth.api
    return api
}

export type BetterSession = Exclude<
    Awaited<ReturnType<typeof getSession>>,
    null
>
export type BetterContext = Awaited<ReturnType<typeof getContext>>
export type BetterApi = ReturnType<typeof api>

export class AuthService extends Context.Tag('AuthService')<
    AuthService,
    {
        getSession: () => Promise<BetterSession | null>
        getContext: () => Promise<BetterContext>
        api: BetterApi
    }
>() {}

export const AuthLive = Layer.succeed(AuthService, {
    getSession,
    getContext,
    api: api(),
})
