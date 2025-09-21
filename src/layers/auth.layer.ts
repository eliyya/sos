import { Layer, Context } from 'effect'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

const getSession = async () => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return null
    return session
}

export type BetterSession = Exclude<
    Awaited<ReturnType<typeof getSession>>,
    null
>

export class SessionService extends Context.Tag('SessionService')<
    SessionService,
    {
        getSession: () => Promise<BetterSession | null>
    }
>() {}

export const SessionLive = Layer.succeed(SessionService, {
    getSession,
})
