import * as Sentry from '@sentry/nextjs'
import { NextRequest, NextResponse } from 'next/server'

export function withSentry(
    handler: (req: NextRequest) => Promise<NextResponse>,
) {
    return async (req: NextRequest) => {
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
