import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

export const dynamic = 'force-dynamic'
class SentryExampleAPIError extends Error {
    constructor(message: string | undefined) {
        super(message)
        this.name = 'SentryExampleAPIError'
    }
}
// A faulty API route to test Sentry's error monitoring
export const GET = Sentry.wrapApiHandlerWithSentry(async function GET() {
    throw new SentryExampleAPIError(
        'This error is raised on the backend called by the example page.',
    )

    return NextResponse.json({ data: 'Testing Sentry Error...' })
}, 'GET /api/test-error')
