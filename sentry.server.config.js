/**
 * this file is used to configure the Sentry client with GlitchTip service
 * see https://app.glitchtip.com/oasis/projects
 */
import * as Sentry from '@sentry/nextjs'

if (!process.env.NEXT_PUBLIC_SENTRY_DSN)
    throw new Error('NEXT_PUBLIC_SENTRY_DSN in .env is required')

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    beforeSend(event) {
        if (process.env.NODE_ENV !== 'production') {
            return null // Descarta el evento
        }
        return event // En producción, se envía normalmente
    },
})
