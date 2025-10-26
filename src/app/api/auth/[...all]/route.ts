import * as Sentry from '@sentry/nextjs'
import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const handlers = toNextJsHandler(auth)

// Wrapper genérico para Sentry
function withSentry(handler: typeof handlers.GET | typeof handlers.POST) {
    return async (req: Request) => {
        try {
            return await handler(req)
        } catch (error) {
            Sentry.captureException(error)
            console.error(error)
            return NextResponse.json(
                {
                    error: 'Internal Server Error',
                },
                {
                    status: 500,
                },
            )
        }
    }
}

export const GET = withSentry(handlers.GET)
export const POST = withSentry(handlers.POST)
