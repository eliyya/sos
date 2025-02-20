import { captureRequestError } from '@sentry/nextjs'
import { Instrumentation } from 'next'

export const onRequestError: Instrumentation.onRequestError = async (
    err,
    request,
    context,
) => {
    if (process.env.NODE_ENV === 'production')
        captureRequestError(err, request, context)
}

export async function register() {
    if (process.env.NODE_ENV === 'production')
        await import('../sentry.server.config')
}
